import scrapy
import os
import json
import browser_cookie3
import boto3
import io
from tqdm import tqdm
from urllib.parse import urljoin
from multiprocessing import Pool
from parsel import Selector
from itertools import repeat
from scrapy import signals
from scrapy.http import Response
from scrapy.loader import ItemLoader
from data_scraper.items import Report, Survey
from data_scraper.helpers import normalize_string


class CourseFeedbackSpider(scrapy.Spider):
    name = "feedback"

    def __init__(self, *args, **kwargs):
        super(CourseFeedbackSpider, self).__init__(*args, **kwargs)

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

        self.s3 = boto3.client('s3')
        file_name = os.path.join("feedback", self.term, ".cache.json")
        with io.BytesIO() as buffer:
            try:
                self.s3.download_fileobj("uozone-data", file_name, buffer)
                buffer.seek(0)

                self.saved_reports = set(json.load(buffer))
            except:
                self.saved_reports = set()

        self.current_page = 1
        self.start_page = (len(self.saved_reports) // 10) + 1

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(CourseFeedbackSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        self.progress_bar.close()
        self.thread_pool.close()

        file_name = os.path.join("feedback", self.term, ".cache.json")
        with io.BytesIO() as buffer:
            buffer.write(json.dumps(list(self.saved_reports)).encode())
            buffer.seek(0)
            self.s3.upload_fileobj(buffer, "uozone-data", file_name)

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

            if term.lower() == self.term:
                yield scrapy.Request(
                    url=url,
                    callback=self.jump_to_start,
                    cookies=self.cookies,
                )

    def jump_to_start(self, response: Response):
        if self.progress_bar is None:
            num_reports = response.css(
                "#ViewList_ctl04_lblTopPageStatus::text"
            ).re_first(r"Results: \d+ - \d+ of (\d+) Item\(s\)")

            self.progress_bar = tqdm(total=int(num_reports), desc="Reports parsed")

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
            yield from self.parse_report_list(response)

    def parse_report_list(self, response: Response):
        # Parse all the reports on the page
        report_links = response.css("a[href^='rpvf-eng.aspx']:not([href$='pdf=true'])")
        for link in report_links:
            url = response.urljoin(link.attrib["href"])
            self.progress_bar.update(1)

            if url in self.saved_reports:
                continue

            self.saved_reports.add(url)

            yield scrapy.Request(
                url=url,
                callback=self.parse_report,
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
                callback=self.parse_report_list,
                cookies=self.cookies,
            )

    def parse_report(self, response: Response):
        report_loader = ItemLoader(Report(), response)
        report_loader.add_value("link", response.url)

        sub_report_loader = report_loader.nested_css("ul:first-child ")
        sub_report_loader.add_css("term", "li:nth-child(1)::text")
        sub_report_loader.add_css("faculty", "li:nth-child(2)::text")
        sub_report_loader.add_css("professor", "li:nth-child(3)::text")
        sub_report_loader.add_css("course", "li:nth-child(4)::text")
        sub_report_loader.add_css("sections", "li:nth-child(4)::text")

        surveys_blocks = response.css(".report-block").getall()
        if self.term_year > 2018 and self.term != "winter 2019":
            surveys = self.thread_pool.starmap(parse_survey_block_v1, zip(surveys_blocks, repeat(response.url)))
        else:
            surveys = self.thread_pool.map(parse_survey_block_v2, surveys_blocks)

        report_loader.add_value("surveys", surveys)
        yield report_loader.load_item()


def parse_survey_block_v1(text, url):
    survey_block = Selector(text)
    survey_image_url = urljoin(url, survey_block.css("img::attr(src)").get())

    survey_loader = ItemLoader(Survey.extract_results(survey_image_url), survey_block)
    survey_loader.add_css("question", "h4 span::text")
    survey_loader.add_css("num_invited", "#Invited + td::text")

    return survey_loader.load_item()


def parse_survey_block_v2(text):
    survey_block = Selector(text)
    survey_loader = ItemLoader(Survey(), survey_block)

    options_table, statistics_table, *_ = survey_block.css("table")
    total_responses = statistics_table.css("tbody tr:first-child td::text").get()

    survey_loader.add_css("question", "h4 span::text")
    survey_loader.add_value("total_responses", total_responses)

    options = []
    for option in options_table.css("tbody tr"):
        label, description = map(normalize_string, option.css("th::text").get().split(": "))
        responses = int(option.css("td::text").get())

        options.append({
            "label": label,
            "description": description,
            "responses": responses,
        })

    survey_loader.add_value("options", options)
    return survey_loader.load_item()
