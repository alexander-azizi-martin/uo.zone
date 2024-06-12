import json
import re

import scrapy
import tqdm
from scrapy.http import Response
from scrapy.loader import ItemLoader

from scraper.helpers import normalize_string
from scraper.items import Professor
from scraper.settings import filesystem

RMP_LINK_PATTERN = re.compile(r"www\.ratemyprofessors\.com\/professor\/\d+\/?")
DEPARTMENT_PATTERN = re.compile(r"in the (.+) department")
RATING_PATTERN = re.compile(r"(\d+(?:\.\d+)?) \/ 5 Overall")
DIFFICULTY_PATTERN = re.compile(r"(\d+(?:\.\d+)?) Level of Difficulty")
NUM_RATINGS_PATTERN = re.compile(r"(\d+) ratings")


class DuckDuckGoRMPSpider(scrapy.Spider):
    name = "ddg_rmp"

    def start_requests(self):
        professors = json.loads(filesystem.get("professor-names.json"))

        for professor in tqdm.tqdm(professors):
            yield scrapy.Request(
                url=f"https://html.duckduckgo.com/html/?q={professor} rate my professor",
                meta={"name": professor},
                headers={
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0"
                },
            )

    def parse(self, response: Response):
        professor_loader = None

        # Find first rate my professor result
        for search_result in response.css("#links .result"):
            url = normalize_string(search_result.css(".result__url::text").get())

            if RMP_LINK_PATTERN.search(url) is None:
                continue

            professor_loader = ItemLoader(
                Professor(),
                search_result.css(".result__snippet"),
            )

            professor_loader.add_value("link", url)
            professor_loader.add_value("name", response.meta["name"])
            professor_loader.add_css("department", "*::text", re=DEPARTMENT_PATTERN)
            professor_loader.add_css("rating", "*::text", re=RATING_PATTERN)
            professor_loader.add_css("difficulty", "*::text", re=DIFFICULTY_PATTERN)
            professor_loader.add_css("num_ratings", "*::text", re=NUM_RATINGS_PATTERN)

            break

        yield None if professor_loader is None else professor_loader.load_item()
