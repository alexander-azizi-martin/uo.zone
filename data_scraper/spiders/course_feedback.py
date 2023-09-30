import scrapy
import os
from scrapy.http import Response
from scrapy.loader import ItemLoader
from data_scraper.items import Report, Survey


class CourseFeedbackSpider(scrapy.Spider):
    name = "feedback"

    def start_requests(self):
        yield scrapy.Request(
            url="https://uottawa.bluera.com/uottawa/rpvlf.aspx?rid=657e46a4-19a0-467b-97cc-d14b06ed85f0&regl=en-US",
            callback=self.parse_report_list,
            cookies={"CookieName": os.getenv("SESSION_COOKIE")},
        )

    def parse_report_list(self, response: Response):
        # Parse all the reports on the page
        report_links = response.css("a[href^='rpvf-eng.aspx']:not([href$='pdf=true'])")
        for link in report_links:
            url, title = link.attrib['href'], link.css('a::text').get()

            yield scrapy.Request(
                url=response.urljoin(url),
                callback=self.parse_report,
                meta={"report_title": title},
                cookies={"CookieName": os.getenv("SESSION_COOKIE")},
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
            yield scrapy.FormRequest(
                url=response.url,
                formdata=new_page_request,
                callback=self.parse_report_list,
                cookies={"CookieName": os.getenv("SESSION_COOKIE")},
            )

    def parse_report(self, response: Response):
        report_loader = ItemLoader(Report(), response)
        report_loader.add_value("title", response.meta["report_title"])
        report_loader.add_value("link", response.url)

        sub_report_loader = report_loader.nested_css("ul:first-child ")
        sub_report_loader.add_css("term", "li:nth-child(1)::text")
        sub_report_loader.add_css("faculty", "li:nth-child(2)::text")
        sub_report_loader.add_css("professor", "li:nth-child(3)::text")
        sub_report_loader.add_css("course", "li:nth-child(4)::text")

        surveys = []
        for survey_block in response.css(".report-block"):
            survey_image_url = response.urljoin(survey_block.css("img::attr(src)").get())
            
            survey_loader = ItemLoader(Survey.extract_results(survey_image_url), survey_block)
            survey_loader.add_css("title", "h4 span::text")
            survey_loader.add_css("num_invited", "#Invited + td::text")

            surveys.append(survey_loader.load_item())

        report_loader.add_value("surveys", surveys)
        yield report_loader.load_item()
