import scrapy


class Survey(scrapy.Item):
    title = scrapy.Field()
    image_url = scrapy.Field()
    num_invited = scrapy.Field()
    total_responses = scrapy.Field()
    options = scrapy.Field()
