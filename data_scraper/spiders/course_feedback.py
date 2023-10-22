import scrapy
import os
import json
import pathlib
from operator import methodcaller, attrgetter
from scrapy.http import Response
from scrapy.loader import ItemLoader
from data_scraper.items import Report, Survey


class CourseFeedbackSpider(scrapy.Spider):
    name = "feedback"
    
    def __init__(self, *args, **kwargs):
        super(CourseFeedbackSpider, self).__init__(*args, **kwargs)

        self.cached_current_page = 1
        if os.path.isfile(".cache"):
            with open(".cache", "r") as f:
                self.cached_current_page = int(f.readline().strip())

        self.current_page = 1
        self.term_season = os.getenv("TERM_SEASON")
        self.term_year = int(os.getenv("TERM_YEAR"))
        self.term = f"{self.term_season} {self.term_year}".lower()
        self.saved_reports = set()

        term_folder = pathlib.Path("backend", "storage", "app", "feedback", self.term)
        if term_folder.exists():
            report_files = filter(methodcaller("is_file"), term_folder.iterdir())
            for report in report_files:
                with report.open() as f:
                    self.saved_reports.add(json.load(f)["link"])

    def cache_current_page(self):
        with open(".cache", "w") as f:
            f.write(f"{self.current_page}")

    def start_requests(self):
        yield scrapy.Request(
            url="https://uozone2.uottawa.ca/en/apps/s-reports",
            callback=self.parse_term_link,
            cookies={"SSESS6483c99e0d6fc7b7554c57814d17fc09": os.getenv("UOZONE_COOKIE")},
        )

    def parse_term_link(self, response: Response):
        term_links = response.css("table a")
        for link in term_links:
            url, term = link.attrib['href'], link.css('a::text').get()

            if term.lower() == self.term:
                callback = self.jump_to_cached_page 
                if True:
                    callback = self.parse_report_list

                yield scrapy.Request(
                    url=url,
                    callback=callback,
                    cookies={"CookieName": os.getenv("BLUERA_COOKIE")},  
                )

    def jump_to_cached_page(self, response: Response):
        start_index = 0 if self.current_page <= 10 else 1
        jump = min(10, self.cached_current_page - self.current_page)
        self.current_page += jump

        new_page_request = {
            "__EVENTTARGET": f"ViewList$ctl04$listing$ctl01$ctl{jump + start_index}",
            "__EVENTARGUMENT": "",
            "__VIEWSTATE": response.css("input[name=__VIEWSTATE]::attr(value)").get(),
            "__VIEWSTATEGENERATOR": response.css("input[name=__VIEWSTATEGENERATOR]::attr(value)").get(),
            "__VIEWSTATEENCRYPTED": "",
            "__EVENTVALIDATION": response.css("input[name=__EVENTVALIDATION]::attr(value)").get(),
            "ViewList$dplField": "Title",
            "ViewList$dplOperator": "contains",
            "ViewList$tbxValue": "",
        }

        callback = self.jump_to_cached_page 
        if self.current_page == self.cached_current_page:
            callback = self.parse_report_list

        yield scrapy.FormRequest(
            url=response.url,
            formdata=new_page_request,
            callback=callback,
            cookies={"CookieName": os.getenv("BLUERA_COOKIE")},
        ) 

    def parse_report_list(self, response: Response):
        # Parse all the reports on the page
        report_links = response.css("a[href^='rpvf-eng.aspx']:not([href$='pdf=true'])")
        for link in report_links:
            url = response.urljoin(link.attrib['href'])

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
        if 'aria-disabled' not in next_page_input.attrib:
            self.current_page += 1
            self.cache_current_page()

            yield scrapy.FormRequest(
                url=response.url,
                formdata=new_page_request,
                callback=self.parse_report_list,
                cookies={"CookieName": os.getenv("BLUERA_COOKIE")},
            )

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

            options_table, statistics_table, *_ = survey_block.css('table')
            total_responses = statistics_table.css("tbody tr:first-child td::text").get()

            survey_loader.add_css("question", "h4 span::text")
            survey_loader.add_value("total_responses", total_responses)

            options = []
            for option in options_table.css('tbody tr'):
                label, description = option.css('th::text').get().split(': ')
                responses = int(option.css('td::text').get())

                options.append({
                    "label": label, 
                    "description": description, 
                    "responses": responses,
                })

            survey_loader.add_value('options', options)
            surveys.append(survey_loader.load_item())

        report_loader.add_value("surveys", surveys)
        yield report_loader.load_item()