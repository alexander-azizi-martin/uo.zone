import scrapy
from itemloaders.processors import Compose, Join, MapCompose, TakeFirst

from data_scraper.helpers import (normalize_string, normalize_whitespace,
                                  remove_whitespace)


def extract_languages(code: str) -> dict[str, int]:
    return {
        "en": int(code[4] in ["0", "1", "2", "3", "4", "9"]),
        "fr": int(code[4] in ["0", "5", "6", "7", "8", "9"]),
    }


class Course(scrapy.Item):
    title = scrapy.Field(
        input_processor=Compose(
            Join(" "),
            normalize_whitespace,
        ),
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
    languages = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            remove_whitespace,
            str.lower,
            extract_languages,
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
    components = scrapy.Field(
        input_processor=Compose(
            Join(" "),
            normalize_whitespace,
        ),
        output_processor=TakeFirst(),
    )
    requirements = scrapy.Field(
        input_processor=Compose(
            Join(" "),
            normalize_whitespace,
        ),
        output_processor=TakeFirst(),
    )
