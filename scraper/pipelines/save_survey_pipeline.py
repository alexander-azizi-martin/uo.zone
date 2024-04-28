import io
import os

import pyparsing as pp
from scrapy.exceptions import CloseSpider, DropItem
from scrapy.exporters import JsonLinesItemExporter

from scraper.items import Survey
from scraper.settings import filesystem


def normalize_name(regex_match):
    [name] = regex_match
    last_name, first_name = name.split(",")
    return f"{first_name.strip()} {last_name.strip()}"


title_parser = (
    pp.Suppress(pp.one_of(["Course Evaluation Report for", "S Report for"]))
    + (
        pp.Regex(r".+,.+(?=\( ?[A-Z]{3} ?\d{3,5})").set_parse_action(normalize_name)
        | pp.Regex(r".+(?=\( ?[A-Z]{3} ?\d{3,5})").set_parse_action(str.strip)
    ).set_results_name("professor")
    + pp.Suppress("(")
    + pp.DelimitedList(
        pp.Group(
            pp.Regex(r"[A-Z]{3} ?\d{3,5}").set_results_name("code")
            + pp.Word(pp.alphanums).set_results_name("section")
            + pp.Regex(r".+?(?=, ?[A-Z]{3} ?\d{3,5}|\))").set_results_name("title")
        ),
    ).set_results_name("courses")
    + pp.Suppress(")")
)


class SaveSurveyPipeline:
    def process_item(self, survey, spider):
        if not isinstance(survey, Survey):
            return survey

        file_name = f"{survey['title'].replace('/', ' ')}.json"
        file_path = os.path.join("surveys", survey["term"].lower(), file_name)

        try:
            parsed_title = title_parser.parse_string(survey["title"]).as_dict()
            survey["professor"] = parsed_title["professor"]
            survey["courses"] = parsed_title["courses"]
        except:
            raise CloseSpider(f"Invalid title format '{survey['title']}'")

        with io.BytesIO() as buffer:
            exporter = JsonLinesItemExporter(buffer)
            exporter.export_item(survey)

            filesystem.put(file_path, buffer.getvalue().decode())

        raise DropItem()
