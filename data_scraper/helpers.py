import unicodedata
import requests
import io
import re
import pytesseract
from PIL import Image
from data_scraper import items


def normalize_string(s):
    normalized = unicodedata.normalize("NFKD", s)
    return normalized.encode("ascii", "ignore").decode("ascii", "ignore")


def download_image(url: str) -> Image:
    response = requests.get(url)

    if response.status_code != 200:
        raise RuntimeError("Could not download image")

    return Image.open(io.BytesIO(response.content))


def extract_survey_results(survey_image: str) -> items.Survey:
    image = download_image(survey_image)
    # Improves text recognition
    bw_image = image.convert("L")

    option_pattern = re.compile(r"([A-Z]):\s+(.*?)\s+\((\d+)\)")
    result_pattern = re.compile(r"Total \((\d+)\)")

    survey = items.Survey({
        "total_responses": 0,
        "options": [],
    })

    text = pytesseract.image_to_string(bw_image)
    lines = filter(len, text.strip().split("\n"))
    for line in lines:
        if match := option_pattern.search(line):
            label, description, responses = match.groups()

            survey["options"].append({
                "label": label, 
                "description": description, 
                "responses": responses
            })
        elif match := result_pattern.search(line):
            survey["total_responses"] = match.group(1)

    return survey
