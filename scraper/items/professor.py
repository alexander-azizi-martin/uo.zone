import scrapy
from itemloaders.processors import MapCompose, TakeFirst

from scraper.helpers import normalize_string


class Professor(scrapy.Item):
    link = scrapy.Field(output_processor=TakeFirst())
    name = scrapy.Field(
        input_processor=MapCompose(normalize_string),
        output_processor=TakeFirst(),
    )
    department = scrapy.Field(output_processor=TakeFirst())
    rating = scrapy.Field(output_processor=TakeFirst())
    difficulty = scrapy.Field(output_processor=TakeFirst())
    num_ratings = scrapy.Field(output_processor=TakeFirst())
