import scrapy
import re
import pytesseract
from itemloaders.processors import MapCompose, TakeFirst
from data_scraper.helpers import normalize_string, download_image


class Survey(scrapy.Item):
    question = scrapy.Field(
        input_processor=MapCompose(
            normalize_string, 
            lambda x: x.split(")", 1).pop().strip(),
        ), 
        output_processor=TakeFirst(),
    )
    num_invited = scrapy.Field(
        input_processor=MapCompose(normalize_string), 
        output_processor=TakeFirst(),
    )
    total_responses = scrapy.Field(
        input_processor=MapCompose(normalize_string, int), 
        output_processor=TakeFirst(),
    )
    image_url = scrapy.Field()
    options = scrapy.Field()

    @staticmethod
    def extract_results(survey_image: str):
        image = download_image(survey_image)
        # Improves text recognition
        bw_image = image.convert("L")

        option_pattern = re.compile(r"([A-Z]):\s+(.*?)\s+\((\d+)\)")
        result_pattern = re.compile(r"Total \((\d+)\)")

        survey = Survey({
            "total_responses": 0,
            "image_url": survey_image,
            "options": [],
        })

        text = pytesseract.image_to_string(bw_image)
        lines = filter(len, text.strip().split("\n"))
        for line in lines:
            if match := option_pattern.search(line):
                label, description, responses = map(normalize_string, match.groups())

                survey["options"].append({
                    "label": label, 
                    "description": description, 
                    "responses": int(responses),
                })
            elif match := result_pattern.search(line):
                survey["total_responses"] = int(normalize_string(match.group(1)))

        return survey
