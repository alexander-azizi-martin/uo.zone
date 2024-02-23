import re

import pytesseract
import scrapy
from itemloaders.processors import MapCompose, TakeFirst

from scraper.helpers import download_image, normalize_string

OPTION_PATTERN = re.compile(r"([A-Z]):\s+(.*?)\s+\((\d+)\)")
RESULT_PATTERN = re.compile(r"Total \((\d+)\)")


class Question(scrapy.Item):
    question = scrapy.Field(
        input_processor=MapCompose(
            normalize_string,
            lambda s: s.split(")", 1).pop().strip("?. "),
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
    image_url = scrapy.Field(output_processor=TakeFirst())
    options = scrapy.Field()

    @staticmethod
    def extract_results(result_image: str):
        image = download_image(result_image)
        # Improves text recognition
        bw_image = image.convert("L")

        question = Question(
            {
                "total_responses": 0,
                "image_url": result_image,
                "options": [],
            }
        )

        text = pytesseract.image_to_string(bw_image)
        lines = filter(len, text.strip().split("\n"))
        for line in lines:
            if match := OPTION_PATTERN.search(line):
                label, description, responses = map(normalize_string, match.groups())

                question["options"].append(
                    {
                        "label": label,
                        "description": description,
                        "responses": int(responses),
                    }
                )
            elif match := RESULT_PATTERN.search(line):
                question["total_responses"] = int(normalize_string(match.group(1)))

        return question
