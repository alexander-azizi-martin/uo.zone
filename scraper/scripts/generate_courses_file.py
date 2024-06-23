import json

from scraper.settings import filesystem

subjects = json.loads(filesystem.get("subjects_en.json"))

courses = {}
for subject in subjects:
    for course in subject["courses"]:
        if course["requirements"] is not None:
            courses[course["code"]] = {
                "title": course["title"],
                "requirements": course["requirements"],
            }

filesystem.put("courses.json", json.dumps(courses))
