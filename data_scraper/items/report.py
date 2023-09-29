import scrapy


class Report(scrapy.Item):
    title = scrapy.Field()
    term = scrapy.Field()
    faculty = scrapy.Field()
    professor = scrapy.Field()
    course = scrapy.Field()
    surveys = scrapy.Field()
    link = scrapy.Field()
