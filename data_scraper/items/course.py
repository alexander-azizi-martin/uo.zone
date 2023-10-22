import scrapy
import re
from itemloaders.processors import Compose, MapCompose, Join, TakeFirst
from operator import methodcaller, itemgetter
from data_scraper.helpers import normalize_string, normalize_whitespace


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
            lambda x: x.lower().replace(" ", ""),
        ),
        output_processor=TakeFirst(),
    )
    language = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            lambda x: x.lower().replace(" ", ""),
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
            str.strip,
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
            methodcaller("split", ": ", 1),
            itemgetter(-1),
        ),
    )
    prereq_description = scrapy.Field(
        input_processor=MapCompose(normalize_string),
        output_processor=Compose(
            Join(" "),
            methodcaller("split", ": ", 1),
            itemgetter(-1),
            remove_prerequisites,
        ),
    )
    prereq_courses = scrapy.Field(
        input_processor=MapCompose(normalize_string),
    )
