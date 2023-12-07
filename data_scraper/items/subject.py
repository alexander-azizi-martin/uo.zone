import re

import scrapy
from itemloaders.processors import MapCompose, TakeFirst

from data_scraper.helpers import normalize_string

FACULTY_PATTERN_EN = re.compile(r"The following (?:courses are|course is) offered by (?:the )?(.+)\.")
FACULTY_PATTERN_FR = re.compile(r"Les? cours (?:suivants sont offerts|suivant est offert) par (?:la )?(.+)")


def extract_faculty(s):
    if (match := FACULTY_PATTERN_EN.match(s)):
        return match.group(1).strip('. ')
    if (match := FACULTY_PATTERN_FR.match(s)):
        return match.group(1).strip('. ')
    return ""


class Subject(scrapy.Item):
    language = scrapy.Field(
        output_processor=TakeFirst(),
    )
    subject = scrapy.Field(
        input_processor=MapCompose(normalize_string), 
        output_processor=TakeFirst(),
    )
    code = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            str.lower,
        ), 
        output_processor=TakeFirst(),
    )
    faculty = scrapy.Field(
        input_processor=MapCompose(
            normalize_string, 
            extract_faculty,
        ),
        output_processor=TakeFirst(),
    )
    courses = scrapy.Field()
