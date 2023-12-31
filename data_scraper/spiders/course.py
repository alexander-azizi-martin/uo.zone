import os
import re

import scrapy
from scrapy.http import Response
from scrapy.loader import ItemLoader

from data_scraper import items


class CourseSpider(scrapy.Spider):
    name = "course"

    def start_requests(self):
        yield scrapy.Request(
            url="https://catalogue.uottawa.ca/en/courses/",
            callback=self.parse_english,
        )
        yield scrapy.Request(
            url="https://catalogue.uottawa.ca/fr/cours/",
            callback=self.parse_french,
        )

    def parse_english(self, response: Response):
        course_pattern = re.compile(r"\/en\/courses\/[a-z]{3}\/")

        urls = response.css("a[href^='/en/courses']::attr(href)").getall()
        for url in urls:
            if course_pattern.search(url) is None:
                continue

            yield scrapy.Request(
                url=response.urljoin(url),
                callback=self.parse_course_list,
                meta={"language": "en"},
            )

    def parse_french(self, response: Response):
        course_pattern = re.compile(r"\/fr\/cours\/[a-z]{3}\/")

        urls = response.css("a[href^='/fr/cours']::attr(href)").getall()
        for url in urls:
            if course_pattern.search(url) is None:
                continue

            yield scrapy.Request(
                url=response.urljoin(url),
                callback=self.parse_course_list,
                meta={"language": "fr"},
            )

    def parse_course_list(self, response: Response):
        subject_pattern = re.compile(r"(.+) \(([A-Z]{3})\)")
        units_pattern = re.compile(r"([0-9]\.?[0-9]*) (unit|crédit)s?")

        subject_loader = ItemLoader(items.Subject(), response)
        subject_loader.add_value("language", response.meta["language"])
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

            course_header = " ".join(
                course_block.css(".courseblocktitle strong::text").get().split()
            )

            units_match = units_pattern.search(course_header)
            if units_match is not None:
                course_loader.add_value("units", units_match.group(1))

            title = re.sub(units_pattern, "", course_header)
            title = re.sub(r"\(( \/ )?\)", "", title)

            course_loader.add_value("title", title)
            course_loader.add_value("code", title, re=r"[A-Z]{3} \d{4,5}")
            course_loader.add_value("languages", title, re=r"[A-Z]{3} \d{4,5}")
            course_loader.add_css("description", ".courseblockdesc *::text")
            course_loader.add_css("components", ".courseblocktitle + .courseblockextra *::text, .courseblockdesc + .courseblockextra *::text")
            course_loader.add_css( "requirements", ".courseblockextra + .courseblockextra *::text")

            courses.append(course_loader.load_item())

        subject_loader.add_value("courses", courses)
        yield subject_loader.load_item()
