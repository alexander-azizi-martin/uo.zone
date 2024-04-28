import io
import re

from scrapy.exceptions import DropItem
from scrapy.exporters import JsonItemExporter

from scraper.items import Subject
from scraper.settings import filesystem


def split_title_languages(s: str) -> dict[str, str]:
    subject, code, title = s.split(" ", 2)
    titles = title.split(" / ")
    parts = len(titles)
    if parts == 1:
        return {
            "en": f"{subject} {code} {s}",
        }

    fr_title = titles[: parts // 2]
    en_title = titles[parts // 2 :]
    return {
        "fr": f"{subject} {code} {' / '.join(fr_title)}",
        "en": f"{subject} {code} {' / '.join(en_title)}",
    }


def split_description_languages(s: str) -> dict[str, str]:
    descriptions = s.split(" / ")
    parts = len(descriptions)
    if parts == 1 or parts % 2 == 1:
        return {
            "en": s,
        }

    fr_description = descriptions[: parts // 2]
    en_description = descriptions[parts // 2 :]
    return {
        "fr": " / ".join(fr_description),
        "en": " / ".join(en_description),
    }


def split_component_languages(s: str) -> dict[str, str]:
    split_components = re.split(r" \/ |: |, ", s)
    fr_components = [split_components[i] for i in range(2, len(split_components), 2)]
    en_components = [split_components[i] for i in range(3, len(split_components), 2)]

    return {
        "fr": fr_components,
        "en": en_components,
    }


def split_requirement_languages(s: str) -> dict[str, str]:
    requirements = s.split(" / ")
    parts = len(requirements)
    if parts == 1:
        return {
            "en": s,
        }

    fr_requirements = requirements[: parts // 2]
    en_requirements = requirements[parts // 2 :]
    return {
        "fr": " / ".join(fr_requirements),
        "en": " / ".join(en_requirements),
    }


class SaveSubjectPipeline:
    def __init__(self):
        self.english_subjects_buffer = io.BytesIO()
        self.english_subjects = JsonItemExporter(self.english_subjects_buffer)
        self.english_subjects.start_exporting()

        self.french_subjects_buffer = io.BytesIO()
        self.french_subjects = JsonItemExporter(self.french_subjects_buffer)
        self.french_subjects.start_exporting()

        self.saved_items = 0

    def process_item(self, subject, spider):
        if not isinstance(subject, Subject):
            return subject

        subject.setdefault("courses", [])

        for course in subject["courses"]:
            course.setdefault("description", "")
            course.setdefault("components", "")
            course.setdefault("requirements", "")

            if course["languages"]["en"] and course["languages"]["fr"]:
                course["title"] = (
                    split_title_languages(course["title"]) if course["title"] else {}
                )
                course["description"] = (
                    split_description_languages(course["description"])
                    if course["description"]
                    else {}
                )
                course["components"] = (
                    split_component_languages(course["components"])
                    if course["components"]
                    else {}
                )
                course["requirements"] = (
                    split_requirement_languages(course["requirements"])
                    if course["requirements"]
                    else {}
                )
            else:
                course["title"] = {
                    language: course["title"]
                    for language in course["languages"]
                    if course["languages"][language]
                }
                course["description"] = {
                    language: course["description"]
                    for language in course["languages"]
                    if course["languages"][language]
                }
                course["components"] = {
                    language: course["components"]
                    .split(": ", 1)
                    .pop()
                    .strip()
                    .split(", ")
                    for language in course["languages"]
                    if course["languages"][language]
                }
                course["requirements"] = {
                    language: course["requirements"]
                    for language in course["languages"]
                    if course["languages"][language]
                }

            for key in ["title", "description", "components", "requirements"]:
                if all(not course[key][language] for language in course[key]):
                    course[key] = None

        if subject["language"] == "en":
            self.english_subjects.export_item(subject)
            self.saved_items += 1
        elif subject["language"] == "fr":
            self.french_subjects.export_item(subject)
            self.saved_items += 1

        raise DropItem()

    def close_spider(self, spider):
        if self.saved_items == 0:
            return

        self.english_subjects.finish_exporting()
        filesystem.put(
            "subjects_en.json", self.english_subjects_buffer.getvalue().decode()
        )
        self.english_subjects_buffer.close()

        self.french_subjects.finish_exporting()
        filesystem.put(
            "subjects_fr.json", self.french_subjects_buffer.getvalue().decode()
        )
        self.french_subjects_buffer.close()
