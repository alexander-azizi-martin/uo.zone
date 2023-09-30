import scrapy
import re
from itemloaders.processors import MapCompose, Compose, TakeFirst
from data_scraper.helpers import normalize_string


def extract_faculty(s):
    faculty_pattern = re.compile(r"The following (?:courses are|course is) offered by (?:the )?(.+)\.")
    return faculty_pattern.match(s).group(1)


class Subject(scrapy.Item):
    subject = scrapy.Field(
        input_processor=MapCompose(normalize_string), 
        output_processor=TakeFirst(),
    )
    code = scrapy.Field(
        input_processor=MapCompose(normalize_string), 
        output_processor=TakeFirst(),
    )
    faculty = scrapy.Field(
        input_processor=MapCompose(normalize_string, extract_faculty),
        output_processor=TakeFirst(),
    )
    courses = scrapy.Field()
