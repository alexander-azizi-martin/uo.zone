import scrapy
from itemloaders.processors import MapCompose, TakeFirst
from operator import methodcaller, itemgetter
from data_scraper.helpers import normalize_string


class Report(scrapy.Item):
    title = scrapy.Field(
        input_processor=MapCompose(normalize_string),
        output_processor=TakeFirst(),
    )
    term = scrapy.Field(
        input_processor=MapCompose(normalize_string),
        output_processor=TakeFirst(),
    )
    faculty = scrapy.Field(
        input_processor=MapCompose(
            normalize_string, 
            methodcaller("split", ": ", 1), 
            itemgetter(-1),
        ),
        output_processor=TakeFirst(),
    )
    professor = scrapy.Field(
        input_processor=MapCompose(
            normalize_string, 
            methodcaller("split", ": ", 1), 
            itemgetter(-1),
        ),
        output_processor=TakeFirst(),
    )
    course = scrapy.Field(
        input_processor=MapCompose(
            normalize_string, 
            methodcaller("split", ": ", 1), 
            itemgetter(-1),
        ),
        output_processor=TakeFirst(),
    )
    link = scrapy.Field()
    surveys = scrapy.Field()
