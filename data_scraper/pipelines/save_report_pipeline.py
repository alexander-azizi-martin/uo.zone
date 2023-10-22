from data_scraper.items import Report
from scrapy.exporters import JsonLinesItemExporter
from scrapy.exceptions import DropItem
import pathlib


class SaveReportPipeline:
    def process_item(self, report, spider):
        if not isinstance(report, Report):
            return report

        file_path = pathlib.Path("backend", "storage", "app", "feedback", report["term"])
        file_path.mkdir(parents=True, exist_ok=True)

        with (file_path / f"{report['course'].replace('/', ' ')}.json").open('wb') as json_file:
            exporter = JsonLinesItemExporter(json_file)
            exporter.export_item(report)

        raise DropItem()
