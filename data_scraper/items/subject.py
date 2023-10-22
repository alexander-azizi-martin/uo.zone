import scrapy
import re
from itemloaders.processors import MapCompose, TakeFirst
from operator import methodcaller
from data_scraper.helpers import normalize_string


def extract_faculty(s):
    faculty_pattern_en = re.compile(r"The following (?:courses are|course is) offered by (?:the )?(.+)\.")
    if (match := faculty_pattern_en.match(s)):
        return match.group(1).strip('. ')
    faculty_pattern_fr = re.compile(r"Les? cours (?:suivants sont offerts|suivant est offert) par (?:la )?(.+)")
    if (match := faculty_pattern_fr.match(s)):
        return match.group(1).strip('. ')
    return ""


class Subject(scrapy.Item):
    subject = scrapy.Field(
        input_processor=MapCompose(normalize_string), 
        output_processor=TakeFirst(),
    )
    code = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            methodcaller('lower'),
        ), 
        output_processor=TakeFirst(),
    )
    faculty = scrapy.Field(
        input_processor=MapCompose(normalize_string, extract_faculty),
        output_processor=TakeFirst(),
    )
    courses = scrapy.Field()
