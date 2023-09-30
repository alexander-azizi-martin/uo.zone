import scrapy
from scrapy.http import Response
import re
from data_scraper import helpers, items
from scrapy.loader import ItemLoader


class CourseSpider(scrapy.Spider):
    name = "course"
    start_urls = ["https://catalogue.uottawa.ca/en/courses/"]

    def parse(self, response: Response):
        course_pattern = re.compile(r"\/en\/courses\/[a-z]{3}\/")

        urls = response.css("a[href^='/en/courses']::attr(href)").getall()
        for url in urls:
            if course_pattern.search(url) is None:
                continue

            yield scrapy.Request(
                url=response.urljoin(url),
                callback=self.parse_course_list,
            )

    def parse_course_list(self, response: Response):
        subject_pattern = re.compile(r"(.+) \(([A-Z]{3})\)")
        title_pattern = re.compile(r"[A-Z]{3} \d{4,5}(?:[A-Z]){0,1} [\w\s\/:]+")
        units_pattern = re.compile(r"([0-9]\.?[0-9]*) (unit|crédit)")

        page_title = response.css("#page-title-area h1::text").get()
        subject, code = subject_pattern.search(page_title).groups()

        subject_loader = ItemLoader(items.Subject(), response)
        subject_loader.add_css("faculty", "#textcontainer > p::text")
        subject_loader.add_value("subject", subject)
        subject_loader.add_value("code", code)

        courses = []
        for course_block in response.css(".courseblock"):
            course_loader = ItemLoader(items.Course(), course_block)

            course_header = " ".join(course_block.css(".courseblocktitle strong::text").get().split())

            units_match = units_pattern.search(course_header)
            if units_match is not None:
                course_loader.add_value("units", units_match.group(1))

            title = title_pattern.search(course_header).group(0)

            course_loader.add_value("title", title)
            course_loader.add_css("description", ".courseblockdesc *::text")
            course_loader.add_css("mentioned_courses", ".courseblockdesc a::text")
            course_loader.add_css("components", ".courseblocktitle + .courseblockextra *::text")
            course_loader.add_css("components", ".courseblockdesc + .courseblockextra *::text")
            course_loader.add_css("prereq_description", ".courseblockextra + .courseblockextra *::text")
            course_loader.add_css("prereq_courses", ".courseblockextra + .courseblockextra a::text")

            courses.append(course_loader.load_item())

        subject_loader.add_value("courses", courses)
        yield subject_loader.load_item()
