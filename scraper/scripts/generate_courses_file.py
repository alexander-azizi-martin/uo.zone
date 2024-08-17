import json

from scraper.settings import filesystem

subjects = json.loads(filesystem.get("subjects_en.json"))

courses = {}
for subject in subjects:
    for course in subject["courses"]:
        courses[course["code"]] = {
            "title": course["title"],
            "requirements": course.get("requirements"),
        }

filesystem.put("courses.json", json.dumps(courses))
