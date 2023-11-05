import io
import os
from scrapy.exporters import JsonLinesItemExporter
from scrapy.exceptions import DropItem
from data_scraper.settings import filesystem
from data_scraper.items import Report


class SaveReportPipeline:
    def process_item(self, report, spider):
        if not isinstance(report, Report):
            return report

        file_name = f"{report['course'].replace('/', ' ')}.json"
        file_path = os.path.join("feedback", report['term'].lower(), file_name)

        with io.StringIO() as buffer:
            exporter = JsonLinesItemExporter(buffer)
            exporter.export_item(report)

            filesystem.put(file_path, buffer.getvalue())

        raise DropItem()
