import scrapy
from scrapy.http import Response
import re
from data_scraper import items
from scrapy.loader import ItemLoader


class CourseSpider(scrapy.Spider):
    name = "course"
    start_urls = ["https://catalogue.uottawa.ca/en/courses/ped/"]

    # def parse(self, response: Response):
    #     course_pattern = re.compile(r"\/en\/courses\/[a-z]{3}\/")

    #     urls = response.css("a[href^='/en/courses']::attr(href)").getall()
    #     for url in urls:
    #         if course_pattern.search(url) is None:
    #             continue

    #         yield scrapy.Request(
    #             url=response.urljoin(url),
    #             callback=self.parse_course_list,
    #         )

    def parse(self, response: Response):
        subject_pattern = re.compile(r"(.+) \(([A-Z]{3})\)")
        units_pattern = re.compile(r"([0-9]\.?[0-9]*) (unit|crédit)s?")

        subject_loader = ItemLoader(items.Subject(), response)
        subject_loader.add_css("faculty", "#textcontainer > p::text")

        page_title = response.css("#page-title-area h1::text").get()
        subject_match = subject_pattern.search(page_title)
        if subject_match is None:
            subject_loader.add_value("subject", page_title)
        else:
            subject, code = subject_match.groups()
            subject_loader.add_value("subject", subject)
            subject_loader.add_value("code", code)

        courses = []
        for course_block in response.css(".courseblock"):
            course_loader = ItemLoader(items.Course(), course_block)

            course_header = " ".join(course_block.css(".courseblocktitle strong::text").get().split())

            units_match = units_pattern.search(course_header)
            if units_match is not None:
                course_loader.add_value("units", units_match.group(1))

            title = re.sub(units_pattern, '', course_header)
            title = re.sub(r"\(( \/ )?\)",'', title)

            course_loader.add_value("title", title)
            course_loader.add_value("code", title, re=r"[A-Z]{3} \d{4,5}")
            course_loader.add_css("description", ".courseblockdesc *::text")
            course_loader.add_css("mentioned_courses", ".courseblockdesc a::text")
            course_loader.add_css("components", ".courseblocktitle + .courseblockextra *::text")
            course_loader.add_css("components", ".courseblockdesc + .courseblockextra *::text")
            course_loader.add_css("prereq_description", ".courseblockextra + .courseblockextra *::text")
            course_loader.add_css("prereq_courses", ".courseblockextra + .courseblockextra a::text")

            courses.append(course_loader.load_item())

        subject_loader.add_value("courses", courses)
        yield subject_loader.load_item()
