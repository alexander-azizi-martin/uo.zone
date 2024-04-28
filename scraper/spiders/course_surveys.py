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

from scraper.helpers import normalize_string
from scraper.items import Question, Survey
from scraper.settings import filesystem

SURVEYS_PER_PAGE = 10


class CourseSurveysSpider(scrapy.Spider):
    name = "surveys"

    def __init__(self, *args, **kwargs):
        super(CourseSurveysSpider, self).__init__(*args, **kwargs)

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
        self.start_page = (len(self.saved_surveys) // SURVEYS_PER_PAGE) + 1
        self.current_page = 1

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        # Makes sure spider_closed is called during cleanup
        spider = super(CourseSurveysSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(
            spider.spider_closed, signal=scrapy.signals.spider_closed
        )
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

            self.progress_bar = tqdm.tqdm(
                total=int(num_surveys), desc="Surveys parsed", disable=False
            )

        if self.current_page < self.start_page:
            offset = 0 if self.current_page <= 10 else 1
            jump = min(10, self.start_page - self.current_page)

            starting_position = int(
                response.css("tr:first-of-type :is(a, span)::text").getall()[offset]
            )
            relative_position = (self.current_page - starting_position) + jump + offset

            self.current_page += jump
            self.progress_bar.update(jump * SURVEYS_PER_PAGE)

            yield scrapy.FormRequest(
                url=response.url,
                callback=self.jump_to_start,
                cookies=self.cookies,
                formdata={
                    "__VIEWSTATE": response.css(
                        "input[name=__VIEWSTATE]::attr(value)"
                    ).get(),
                    "__VIEWSTATEGENERATOR": response.css(
                        "input[name=__VIEWSTATEGENERATOR]::attr(value)"
                    ).get(),
                    "__EVENTVALIDATION": response.css(
                        "input[name=__EVENTVALIDATION]::attr(value)"
                    ).get(),
                    "__EVENTTARGET": f"ViewList$ctl04$listing$ctl01$ctl{relative_position}",
                    "__EVENTARGUMENT": "",
                    "__VIEWSTATEENCRYPTED": "",
                    "ViewList$dplField": "Title",
                    "ViewList$dplOperator": "contains",
                    "ViewList$tbxValue": "",
                },
            )
        else:
            yield from self.parse_survey_list(response)

    def parse_survey_list(self, response: Response):
        survey_links = response.css("td:nth-child(3) > a")
        for link in survey_links:
            title = link.css("a::text").get()
            relative_url = link.attrib.get("href", None)

            self.progress_bar.update(1)
            if title in self.saved_surveys:
                continue

            self.saved_surveys.add(title)

            survey = Survey(title=title, term=self.term.capitalize())
            if relative_url is not None:
                url = response.urljoin(relative_url)
                yield scrapy.Request(
                    url=url,
                    callback=self.parse_survey,
                    cookies=self.cookies,
                    meta={"survey": survey},
                )
            else:
                yield survey

        next_page_input = response.css(
            "input[name='ViewList$ctl04$listing$ctl01$btnNext']"
        )
        if "aria-disabled" not in next_page_input.attrib:
            yield scrapy.FormRequest(
                url=response.url,
                callback=self.parse_survey_list,
                cookies=self.cookies,
                formdata={
                    "__VIEWSTATE": response.css(
                        "input[name=__VIEWSTATE]::attr(value)"
                    ).get(),
                    "__VIEWSTATEGENERATOR": response.css(
                        "input[name=__VIEWSTATEGENERATOR]::attr(value)"
                    ).get(),
                    "__EVENTVALIDATION": response.css(
                        "input[name=__EVENTVALIDATION]::attr(value)"
                    ).get(),
                    "__EVENTTARGET": "",
                    "__EVENTARGUMENT": "",
                    "__VIEWSTATEENCRYPTED": "",
                    "ViewList$dplField": "Title",
                    "ViewList$dplOperator": "contains",
                    "ViewList$tbxValue": "",
                    "ViewList$ctl04$listing$ctl01$btnNext": "",
                },
            )

    def parse_survey(self, response: Response):
        response.meta["survey"]["link"] = response.url

        question_blocks = response.css(".report-block").getall()
        if self.term_year > 2018 and self.term != "winter 2019":
            response.meta["survey"]["questions"] = self.thread_pool.starmap(
                parse_question_block_v1, zip(question_blocks, repeat(response.url))
            )
        else:
            response.meta["survey"]["questions"] = self.thread_pool.map(
                parse_question_block_v2, question_blocks
            )

        yield response.meta["survey"]


def parse_question_block_v1(text: str, url: str) -> Question:
    question_block = parsel.Selector(text)
    result_image_url = urljoin(url, question_block.css("img::attr(src)").get())

    question_loader = ItemLoader(
        Question.extract_results(result_image_url), question_block
    )
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
        label, description = map(
            normalize_string, option.css("th::text").get().split(": ")
        )
        responses = int(option.css("td::text").get())

        options.append(
            {
                "label": label,
                "description": description,
                "responses": responses,
            }
        )

    question_loader.add_value("options", options)
    return question_loader.load_item()
