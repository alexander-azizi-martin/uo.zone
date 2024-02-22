import io
import os

from scrapy.exceptions import DropItem
from scrapy.exporters import JsonLinesItemExporter

from data_scraper.items import Survey
from data_scraper.settings import filesystem


class SaveSurveyPipeline:
    def process_item(self, survey, spider):
        if not isinstance(survey, Survey):
            return survey

        file_name = f"{survey['course'].replace('/', ' ')}.json"
        file_path = os.path.join("surveys", survey["term"].lower(), file_name)

        with io.BytesIO() as buffer:
            exporter = JsonLinesItemExporter(buffer)
            exporter.export_item(survey)

            filesystem.put(file_path, buffer.getvalue().decode())

        raise DropItem()
