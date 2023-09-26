import scrapy


class Report(scrapy.Item):
    term = scrapy.Field()
    faculty = scrapy.Field()
    professor = scrapy.Field()
    course = scrapy.Field()
    surveys = scrapy.Field()
    link = scrapy.Field()
