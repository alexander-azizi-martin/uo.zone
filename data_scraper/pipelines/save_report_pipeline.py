import boto3
import io
import os
from scrapy.exporters import JsonLinesItemExporter
from scrapy.exceptions import DropItem
from data_scraper.items import Report


class SaveReportPipeline:
    def __init__(self) -> None:
        self.s3 = boto3.client('s3')

    def process_item(self, report, spider):
        if not isinstance(report, Report):
            return report

        file_name = f"{report['course'].replace('/', ' ')}.json"
        file_path = os.path.join("feedback", report['term'].lower(), file_name)

        with io.BytesIO() as buffer:
            exporter = JsonLinesItemExporter(buffer)
            exporter.export_item(report)

            buffer.seek(0)
            self.s3.upload_fileobj(buffer, "uozone-data", file_path)

        raise DropItem()
