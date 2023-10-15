import scrapy
from itemloaders.processors import MapCompose, Compose, TakeFirst
from operator import methodcaller
from data_scraper.helpers import normalize_string


def normalize_term(term):
    token1, token2 = term.lower().strip("term").strip().split(" ")

    if token1.isdigit():
        return f"{token2.capitalize()} {token1}"
    else:
        return f"{token1.capitalize()} {token2}"


def normalize_professor_name(name):
    last_name, first_name = name.split(",")
    return f"{first_name} {last_name}".strip()


def extract_codes(name):
    courses = name.split(",")
    course_codes = [course.strip().split(" ").pop(0).strip() for course in courses]
    unique_course_codes = list(set(course_codes))
    return unique_course_codes


class Report(scrapy.Item):
    term = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            normalize_term,
        ),
        output_processor=TakeFirst(),
    )
    faculty = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            lambda x: x.split(":", 1).pop().strip(),
        ),
        output_processor=TakeFirst(),
    )
    professor = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            lambda x: x.split(":", 1).pop().strip(),
            normalize_professor_name,
        ),
        output_processor=TakeFirst(),
    )
    course = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            lambda x: x.split(":", 1).pop().strip(),
        ),
        output_processor=TakeFirst(),
    )
    codes = scrapy.Field(
        input_processor=Compose(
            TakeFirst(),
            normalize_string,
            lambda x: x.split(":", 1).pop().strip(),
            extract_codes,
        ),
    )
    link = scrapy.Field(output_processor=TakeFirst())
    surveys = scrapy.Field()
