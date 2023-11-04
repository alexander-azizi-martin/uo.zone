import scrapy
import re
from itemloaders.processors import Compose, MapCompose, Join, TakeFirst
from operator import methodcaller, itemgetter
from data_scraper.helpers import normalize_string, normalize_whitespace, remove_whitespace


def remove_prerequisites(s):
    prerequisites_pattern = re.compile(r"Prerequisites( or corequisites)?: ([^\.]*)\.")
    return re.sub(prerequisites_pattern, "", s)


def extract_language(code):
    return "en" if int(code[4]) < 5 else "fr"


class Course(scrapy.Item):
    title = scrapy.Field(
        input_processor=MapCompose(normalize_string),
        output_processor=TakeFirst(),
    )
    code = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            remove_whitespace,
            str.lower,
        ),
        output_processor=TakeFirst(),
    )
    language = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            remove_whitespace,
            str.lower,
            extract_language,
        ),
        output_processor=TakeFirst(),
    )
    units = scrapy.Field(
        input_processor=MapCompose(normalize_string),
        output_processor=TakeFirst(),
    )
    description = scrapy.Field(
        input_processor=Compose(
            Join(" "),
            normalize_whitespace,
        ),
        output_processor=TakeFirst(),
    )
    mentioned_courses = scrapy.Field(
        input_processor=MapCompose(normalize_string),
    )
    components = scrapy.Field(
        input_processor=MapCompose(normalize_string),
        output_processor=Compose(
            Join(" "),
            lambda s: s.split(":", 1).pop().strip(),
        ),
    )
    prereq_description = scrapy.Field(
        input_processor=MapCompose(normalize_string),
        output_processor=Compose(
            Join(" "),
            lambda s: s.split(":", 1).pop().strip(),
            remove_prerequisites,
        ),
    )
    prereq_courses = scrapy.Field(
        input_processor=MapCompose(normalize_string),
    )
