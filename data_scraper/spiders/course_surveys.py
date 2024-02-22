import json
import os
from itertools import repeat
from multiprocessing import Pool
from urllib.parse import urljoin

import browser_cookie3
import parsel
import scrapy
import tqdm
from scrapy.http import Response
from scrapy.loader import ItemLoader

from data_scraper.helpers import normalize_string
from data_scraper.items import Question, Survey
from data_scraper.settings import filesystem


class CourseSurveySpider(scrapy.Spider):
    name = "surveys"

    def __init__(self, *args, **kwargs):
        super(CourseSurveySpider, self).__init__(*args, **kwargs)

        self.thread_pool = Pool(12)
        self.progress_bar = None
        self.term_season = os.getenv("TERM_SEASON")
        self.term_year = int(os.getenv("TERM_YEAR"))
        self.term = f"{self.term_season} {self.term_year}".lower()
        self.cookies = {}

        browser_cookies = browser_cookie3.firefox()
        for cookie in browser_cookies:
            if cookie.name == "CookieName":
                self.cookies[cookie.name] = cookie.value
            elif cookie.name == "SSESS6483c99e0d6fc7b7554c57814d17fc09":
                self.cookies[cookie.name] = cookie.value

        cache_file_name = os.path.join("surveys", self.term, ".cache.json")
        cache_file_data = filesystem.get(cache_file_name, "[]")

        self.saved_surveys = set(json.loads(cache_file_data))
        self.start_page = (len(self.saved_surveys) // 10) + 1
        self.current_page = 1

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        # Makes sure spider_closed is called during cleanup
        spider = super(CourseSurveySpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=scrapy.signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        if self.progress_bar:
            self.progress_bar.close()
        if self.thread_pool:
            self.thread_pool.close()

        cache_file_name = os.path.join("surveys", self.term, ".cache.json")
        cache_file_data = json.dumps(list(self.saved_surveys))

        filesystem.put(cache_file_name, cache_file_data)

    def start_requests(self):
        yield scrapy.Request(
            url="https://uozone2.uottawa.ca/en/apps/s-reports",
            callback=self.parse_term_link,
            cookies=self.cookies,
        )

    def parse_term_link(self, response: Response):
        term_links = response.css("table a")
        for link in term_links:
            url, term = link.attrib["href"], link.css("a::text").get()

            if term.lower().replace("spring/", "") == self.term:
                yield scrapy.Request(
                    url=url,
                    callback=self.jump_to_start,
                    cookies=self.cookies,
                )

    def jump_to_start(self, response: Response):
        if self.progress_bar is None:
            num_surveys = response.css(
                "#ViewList_ctl04_lblTopPageStatus::text"
            ).re_first(r"Results: \d+ - \d+ of (\d+) Item\(s\)")

            self.progress_bar = tqdm.tqdm(total=int(num_surveys), desc="Surveys parsed")

        if self.current_page < self.start_page:
            offset = 0 if self.current_page <= 10 else 1
            jump = min(10, self.start_page - self.current_page)
            self.current_page += jump
            self.progress_bar.update(jump * 10)

            new_page_request = {
                "__EVENTTARGET": f"ViewList$ctl04$listing$ctl01$ctl{jump + offset}",
                "__EVENTARGUMENT": "",
                "__VIEWSTATE": response.css("input[name=__VIEWSTATE]::attr(value)").get(),
                "__VIEWSTATEGENERATOR": response.css("input[name=__VIEWSTATEGENERATOR]::attr(value)").get(),
                "__VIEWSTATEENCRYPTED": "",
                "__EVENTVALIDATION": response.css("input[name=__EVENTVALIDATION]::attr(value)").get(),
                "ViewList$dplField": "Title",
                "ViewList$dplOperator": "contains",
                "ViewList$tbxValue": "",
            }

            yield scrapy.FormRequest(
                url=response.url,
                formdata=new_page_request,
                callback=self.jump_to_start,
                cookies=self.cookies,
            )
        else:
            yield from self.parse_survey_list(response)

    def parse_survey_list(self, response: Response):
        # Parse all the surveys on the page
        survey_links = response.css("a[href^='rpvf-eng.aspx']:not([href$='pdf=true'])")
        for link in survey_links:
            url = response.urljoin(link.attrib["href"])
            self.progress_bar.update(1)

            if url in self.saved_surveys:
                continue

            self.saved_surveys.add(url)

            yield scrapy.Request(
                url=url,
                callback=self.parse_survey,
                cookies=self.cookies,
            )

        # Goes to the next page
        new_page_request = {
            "__EVENTTARGET": "",
            "__EVENTARGUMENT": "",
            "__VIEWSTATE": response.css("input[name=__VIEWSTATE]::attr(value)").get(),
            "__VIEWSTATEGENERATOR": response.css("input[name=__VIEWSTATEGENERATOR]::attr(value)").get(),
            "__VIEWSTATEENCRYPTED": "",
            "__EVENTVALIDATION": response.css("input[name=__EVENTVALIDATION]::attr(value)").get(),
            "ViewList$dplField": "Title",
            "ViewList$dplOperator": "contains",
            "ViewList$tbxValue": "",
            "ViewList$ctl04$listing$ctl01$btnNext": "",
        }

        next_page_input = response.css("input[name='ViewList$ctl04$listing$ctl01$btnNext']")
        if "aria-disabled" not in next_page_input.attrib:
            yield scrapy.FormRequest(
                url=response.url,
                formdata=new_page_request,
                callback=self.parse_survey_list,
                cookies=self.cookies,
            )

    def parse_survey(self, response: Response):
        survey_loader = ItemLoader(Survey(), response)
        survey_loader.add_value("link", response.url)

        sub_survey_loader = survey_loader.nested_css("ul:first-child ")
        sub_survey_loader.add_css("term", "li:nth-child(1)::text")
        sub_survey_loader.add_css("faculty", "li:nth-child(2)::text")
        sub_survey_loader.add_css("professor", "li:nth-child(3)::text")
        sub_survey_loader.add_css("course", "li:nth-child(4)::text")
        sub_survey_loader.add_css("sections", "li:nth-child(4)::text")

        question_blocks = response.css(".report-block").getall()
        if self.term_year > 2018 and self.term != "winter 2019":
            questions = self.thread_pool.starmap(parse_question_block_v1, zip(question_blocks, repeat(response.url)))
        else:
            questions = self.thread_pool.map(parse_question_block_v2, question_blocks)

        survey_loader.add_value("questions", questions)
        yield survey_loader.load_item()


def parse_question_block_v1(text: str, url: str) -> Question:
    question_block = parsel.Selector(text)
    result_image_url = urljoin(url, question_block.css("img::attr(src)").get())

    question_loader = ItemLoader(Question.extract_results(result_image_url), question_block)
    question_loader.add_css("question", "h4 span::text")
    question_loader.add_css("num_invited", "#Invited + td::text")

    return question_loader.load_item()


def parse_question_block_v2(text: str) -> Question:
    question_block = parsel.Selector(text)
    question_loader = ItemLoader(Question(), question_block)

    options_table, statistics_table, *_ = question_block.css("table")
    total_responses = statistics_table.css("tbody tr:first-child td::text").get()

    question_loader.add_css("question", "h4 span::text")
    question_loader.add_value("total_responses", total_responses)

    options = []
    for option in options_table.css("tbody tr"):
        label, description = map(normalize_string, option.css("th::text").get().split(": "))
        responses = int(option.css("td::text").get())

        options.append({
            "label": label,
            "description": description,
            "responses": responses,
        })

    question_loader.add_value("options", options)
    return question_loader.load_item()
