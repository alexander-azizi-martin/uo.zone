import scrapy
from itemloaders.processors import MapCompose, Compose, TakeFirst
from data_scraper.helpers import normalize_string, normalize_whitespace


def normalize_term(term: str) -> str:
    token1, token2 = term.lower().replace("term", "").strip(" :").split(" ")

    if token1.isdigit():
        return f"{token2.capitalize()} {token1}"
    else:
        return f"{token1.capitalize()} {token2}"


def normalize_professor_name(name: str) -> str:
    if "," not in name:
        return name

    last_name, first_name = name.split(",")
    return f"{first_name} {last_name}".strip()


def extract_codes(name: str) -> str:
    courses = name.lower().split(",")

    course_codes = []
    for course in courses:
        split_course = course.strip().split(" ", 2)
        if len(split_course) < 3:
            continue

        code, section, _ = course.strip().split(" ", 2)

        course_codes.append({
            "code": code.strip(),
            "section": section.strip(),
        })

    return course_codes


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
            lambda s: s.split(":", 1).pop().strip(),
        ),
        output_processor=TakeFirst(),
    )
    professor = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            lambda s: s.split(":", 1).pop().strip(),
            normalize_professor_name,
        ),
        output_processor=TakeFirst(),
    )
    course = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            lambda s: s.split(":", 1).pop().strip(),
        ),
        output_processor=TakeFirst(),
    )
    sections = scrapy.Field(
        input_processor=Compose(
            TakeFirst(),
            normalize_string,
            lambda s: s.split(":", 1).pop().strip(),
            extract_codes,
        ),
    )
    link = scrapy.Field(output_processor=TakeFirst())
    surveys = scrapy.Field()
