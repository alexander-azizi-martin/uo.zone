import re

import scrapy
from scrapy.http import Response
from scrapy.loader import ItemLoader

from scraper.helpers import normalize_whitespace
from scraper.items import Course, Subject

EN_COURSE_PATTERN = re.compile(r"\/en\/courses\/[a-z]{3}\/")
FR_COURSE_PATTERN = re.compile(r"\/fr\/cours\/[a-z]{3}\/")
SUBJECT_PATTERN = re.compile(r"(.+) \(([A-Z]{3})\)")
UNITS_PATTERN = re.compile(r"([0-9]\.?[0-9]*) (unit|crédit)s?")


class CoursesSpider(scrapy.Spider):
    name = "courses"

    def start_requests(self):
        yield scrapy.Request(
            url="https://catalogue.uottawa.ca/en/courses/",
            callback=self.parse,
            meta={"language": "en"},
        )
        yield scrapy.Request(
            url="https://catalogue.uottawa.ca/fr/cours/",
            callback=self.parse,
            meta={"language": "fr"},
        )

    def parse(self, response: Response):
        language = response.meta["language"]

        urls = response.css("a::attr(href)").getall()
        for url in urls:
            if language == "en" and EN_COURSE_PATTERN.search(url) is None:
                continue
            if language == "fr" and FR_COURSE_PATTERN.search(url) is None:
                continue

            yield scrapy.Request(
                url=response.urljoin(url),
                callback=self.parse_course_list,
                meta={"language": language},
            )

    def parse_course_list(self, response: Response):
        subject_loader = ItemLoader(Subject(), response)
        subject_loader.add_value("language", response.meta["language"])
        subject_loader.add_css("faculty", "#textcontainer > p::text")

        page_title = response.css("#page-title-area h1::text").get()
        subject_match = SUBJECT_PATTERN.search(page_title)
        if subject_match is None:
            subject_loader.add_value("subject", page_title)
        else:
            subject, code = subject_match.groups()
            subject_loader.add_value("subject", subject)
            subject_loader.add_value("code", code)

        courses = []
        for course_block in response.css(".courseblock"):
            course_loader = ItemLoader(Course(), course_block)

            course_header = normalize_whitespace(
                course_block.css(".courseblocktitle strong::text").get()
            )

            units_match = UNITS_PATTERN.search(course_header)
            if units_match is not None:
                course_loader.add_value("units", units_match.group(1))

            title = re.sub(UNITS_PATTERN, "", course_header)
            title = re.sub(r"\(( \/ )?\)", "", title)

            course_loader.add_value("title", title)
            course_loader.add_value("code", title, re=r"[A-Z]{3} \d{4,5}")
            course_loader.add_value("languages", title, re=r"[A-Z]{3} \d{4,5}")
            course_loader.add_css("description", ".courseblockdesc *::text")

            course_loader.add_css(
                "components",
                ".courseblocktitle + .courseblockextra *::text, .courseblockdesc + .courseblockextra *::text",
            )
            course_loader.add_css(
                "requirements",
                ".courseblockextra + .courseblockextra *::text",
            )

            courses.append(course_loader.load_item())

        subject_loader.add_value("courses", courses)
        yield subject_loader.load_item()
