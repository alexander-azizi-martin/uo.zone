import scrapy
from scrapy.http import Response
import urllib.parse
import os
from data_scraper import helpers, items


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
                url=urllib.parse.urljoin(response.url, url),
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
        term, faculty, professor, course = map(
            helpers.normalize_string, response.css("ul:first-child li::text").getall()
        )

        report = items.Report({
            "title": response.meta["report_title"],
            "term": term,
            "faculty": faculty,
            "professor": professor,
            "course": course,
            "link": response.url,
            "surveys": [],
        })

        surveys = response.css(".report-block")
        for survey in surveys:
            survey_title = helpers.normalize_string(survey.css("h4 span::text").get())
            survey_image_url = urllib.parse.urljoin(response.url, survey.css("img::attr(src)").get())
            survey_num_invited = survey.css("#Invited + td::text").get()

            survey = helpers.extract_survey_results(survey_image_url)
            survey["title"] = survey_title
            survey["image_url"] = survey_image_url
            survey["num_invited"] = survey_num_invited

            report["surveys"].append(survey)

        yield report
