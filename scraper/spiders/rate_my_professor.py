import scrapy
import tqdm
from parsel import Selector
from scrapy.http import Response
from scrapy.loader import ItemLoader
from scrapy_playwright.page import PageMethod

from scraper.items import Professor


class RateMyProfessorSpider(scrapy.Spider):
    name = "rmp"

    def start_requests(self):
        yield scrapy.Request(
            url="https://www.ratemyprofessors.com/professor/9310",
            meta={
                "playwright": True,
                "playwright_include_page": True,
                "playwright_page_methods": [
                    PageMethod("wait_for_selector", "[class*='PaginationButton']"),
                ],
            },
        )

    async def parse(self, response: Response):
        page = response.meta["playwright_page"]

        results = Selector(await page.content()).css(
            "[data-testid='pagination-header-main-results']::text"
        )
        [num_results] = results.re(r"\d+")

        progress_bar = tqdm.tqdm(total=int(num_results), desc="Professors")
        progress_bar.update(8)

        await page.get_by_alt_text("Banner Close Icon").click()
        load_more_button = await page.get_by_text("Show More").element_handle()
        while True:
            try:
                await load_more_button.click()
                await load_more_button.wait_for_element_state("enabled")
                progress_bar.update(8)
            except:
                break

        page_selector = Selector(await page.content())
        for professor_card in page_selector.css("[href^='/professor']"):
            professor_loader = ItemLoader(Professor(), professor_card)

            professor_loader.add_value(
                "link", response.urljoin(professor_card.attrib["href"])
            )
            professor_loader.add_css("name", "[class*='CardName']::text")
            professor_loader.add_css("department", "[class*='Department']::text")
            professor_loader.add_css("rating", "[class*='CardNumRatingNumber']::text")
            professor_loader.add_css(
                "difficulty",
                "[class*='CardFeedbackItem']:nth-child(3) [class*='CardFeedbackNumber']::text",
            )
            professor_loader.add_css(
                "num_ratings", "[class*='CardNumRatingCount']::text", re=r"\d+"
            )

            yield professor_loader.load_item()

        await page.close()

    async def close_page(self, error):
        page = error.request.meta["playwright_page"]
        await page.close()
