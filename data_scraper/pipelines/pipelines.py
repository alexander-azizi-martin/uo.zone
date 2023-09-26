from itemadapter import ItemAdapter
from data_scraper import items
import json


class SaveReportPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        if not adapter.is_item_class(items.Report):
            return item

        file_name = f'temp/{adapter["term"]} - {adapter["course"]}.json'
        with open(file_name, "w") as json_file:
            json.dump(dict(item), json_file)

        return item
