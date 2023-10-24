import scrapy
import os
import json
import pathlib
import browser_cookie3
from tqdm import tqdm
from operator import methodcaller
from scrapy.http import Response
from scrapy.loader import ItemLoader
from data_scraper.items import Report, Survey
from data_scraper.helpers import normalize_string


class CourseFeedbackSpider(scrapy.Spider):
    name = "feedback"

    def __init__(self, *args, **kwargs):
        super(CourseFeedbackSpider, self).__init__(*args, **kwargs)

        self.progress_bar = None
        self.term_season = os.getenv("TERM_SEASON")
        self.term_year = int(os.getenv("TERM_YEAR"))
        self.term = f"{self.term_season} {self.term_year}".lower()
        self.cookies = {}
        self.saved_reports = set()

        browser_cookies = browser_cookie3.firefox()
        for cookie in browser_cookies:
            if "login.microsoftonline.com" in cookie.domain:
                self.cookies[cookie.name] = cookie.value

        term_folder = pathlib.Path("backend", "storage", "app", "feedback", self.term)
        term_folder.mkdir(parents=True, exist_ok=True)
        report_files = filter(methodcaller("is_file"), term_folder.iterdir())
        for report in report_files:
            with report.open() as f:
                self.saved_reports.add(json.load(f)["link"])

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
                    callback=self.parse_report_list,
                    cookies=self.cookies,
                )

    def parse_report_list(self, response: Response):
        if self.progress_bar is None:
            num_reports = response.css(
                "#ViewList_ctl04_lblTopPageStatus::text"
            ).re_first(r"Results: \d+ - \d+ of (\d+) Item\(s\)")

            self.progress_bar = tqdm(total=int(num_reports), desc="Reports parsed")

        # Parse all the reports on the page
        report_links = response.css("a[href^='rpvf-eng.aspx']:not([href$='pdf=true'])")
        for link in report_links:
            url = response.urljoin(link.attrib["href"])
            self.progress_bar.update(1)

            if url in self.saved_reports:
                continue

            callback = self.parse_report_v1
            if self.term_year <= 2018 or self.term == "winter 2019":
                callback = self.parse_report_v2

            yield scrapy.Request(
                url=url,
                callback=callback,
                cookies={"CookieName": os.getenv("BLUERA_COOKIE")},
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
        else:
            self.progress_bar.close()

    def parse_report_v1(self, response: Response):
        report_loader = ItemLoader(Report(), response)
        report_loader.add_value("link", response.url)

        sub_report_loader = report_loader.nested_css("ul:first-child ")
        sub_report_loader.add_css("term", "li:nth-child(1)::text")
        sub_report_loader.add_css("faculty", "li:nth-child(2)::text")
        sub_report_loader.add_css("professor", "li:nth-child(3)::text")
        sub_report_loader.add_css("course", "li:nth-child(4)::text")
        sub_report_loader.add_css("sections", "li:nth-child(4)::text")

        surveys = []
        for survey_block in response.css(".report-block"):
            survey_image_url = response.urljoin(survey_block.css("img::attr(src)").get())

            survey_loader = ItemLoader(Survey.extract_results(survey_image_url), survey_block)
            survey_loader.add_css("question", "h4 span::text")
            survey_loader.add_css("num_invited", "#Invited + td::text")

            surveys.append(survey_loader.load_item())

        report_loader.add_value("surveys", surveys)
        yield report_loader.load_item()

    def parse_report_v2(self, response: Response):
        report_loader = ItemLoader(Report(), response)
        report_loader.add_value("link", response.url)

        sub_report_loader = report_loader.nested_css("ul:first-child ")
        sub_report_loader.add_css("term", "li:nth-child(1)::text")
        sub_report_loader.add_css("faculty", "li:nth-child(2)::text")
        sub_report_loader.add_css("professor", "li:nth-child(3)::text")
        sub_report_loader.add_css("course", "li:nth-child(4)::text")
        sub_report_loader.add_css("sections", "li:nth-child(4)::text")

        surveys = []
        for survey_block in response.css(".report-block"):
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
                    "description": description.strip("?."),
                    "responses": responses,
                })

            survey_loader.add_value("options", options)
            surveys.append(survey_loader.load_item())

        report_loader.add_value("surveys", surveys)
        yield report_loader.load_item()
