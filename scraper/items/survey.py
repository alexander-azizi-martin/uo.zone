import scrapy


class Survey(scrapy.Item):
    title = scrapy.Field()
    term = scrapy.Field()
    professor = scrapy.Field()
    courses = scrapy.Field()
    link = scrapy.Field()
    questions = scrapy.Field()
