import io
import os
from scrapy.exporters import JsonLinesItemExporter
from scrapy.exceptions import DropItem
from data_scraper.settings import filesystem
from data_scraper.items import Survey


class SaveSurveyPipeline:
    def process_item(self, survey, spider):
        if not isinstance(survey, Survey):
            return survey

        file_name = f"{survey['course'].replace('/', ' ')}.json"
        file_path = os.path.join("surveys", survey["term"].lower(), file_name)

        with io.StringIO() as buffer:
            exporter = JsonLinesItemExporter(buffer)
            exporter.export_item(survey)

            filesystem.put(file_path, buffer.getvalue())

        raise DropItem()
