import json
import pathlib
import time

import ratemyprofessor
import tqdm

storage_dir = pathlib.Path("backend", "storage", "app")

with (storage_dir / "missing-professors.json").open() as f:
    missing_professors = json.load(f)

ottawa = ratemyprofessor.School(1452)
carleton = ratemyprofessor.School(1420)

with (storage_dir / "missing-professors-data.json").open() as f:
    missing_professors_data = json.load(f)

for name in tqdm.tqdm(missing_professors):
    with (storage_dir / "missing-professors-data.json").open("w") as f:
        json.dump(list(missing_professors_data), f)

    time.sleep(2)
    data = ratemyprofessor.get_professor_by_school_and_name(ottawa, name)
    if data is not None:
        missing_professors_data.append({
            "link": f"https://www.ratemyprofessors.com/professor/{data.id}",
            "name": name,
            "department": data.department,
            "rating": data.rating,
            "difficulty": data.difficulty,
            "num_ratings": data.num_ratings
        })
        missing_professors.remove(name)
        with (storage_dir / "missing-professors.json").open("w") as f:
            json.dump(list(missing_professors), f)
        continue

    time.sleep(2)
    data = ratemyprofessor.get_professor_by_school_and_name(carleton, name)
    if data is not None:
        missing_professors_data.append({
            "link": f"https://www.ratemyprofessors.com/professor/{data.id}",
            "name": name,
            "department": data.department,
            "rating": data.rating,
            "difficulty": data.difficulty,
            "num_ratings": data.num_ratings
        })
        missing_professors.remove(name)
        with (storage_dir / "missing-professors.json").open("w") as f:
            json.dump(list(missing_professors), f)
        continue

    name_parts = name.split(" ")
    if name_parts != 3:
        continue
    
    first, middle, last = name_parts
    name_without_middle = f"{first} {last}"
    
    time.sleep(2)
    data = ratemyprofessor.get_professor_by_school_and_name(ottawa, name_without_middle)
    if data is not None:
        missing_professors_data.append({
            "link": f"https://www.ratemyprofessors.com/professor/{data.id}",
            "name": name,
            "department": data.department,
            "rating": data.rating,
            "difficulty": data.difficulty,
            "num_ratings": data.num_ratings
        })
        missing_professors.remove(name)
        with (storage_dir / "missing-professors.json").open("w") as f:
            json.dump(list(missing_professors), f)
        continue

    time.sleep(2)
    data = ratemyprofessor.get_professor_by_school_and_name(carleton, name_without_middle)
    if data is not None:
        missing_professors_data.append({
            "link": f"https://www.ratemyprofessors.com/professor/{data.id}",
            "name": name,
            "department": data.department,
            "rating": data.rating,
            "difficulty": data.difficulty,
            "num_ratings": data.num_ratings
        })
        missing_professors.remove(name)
        with (storage_dir / "missing-professors.json").open("w") as f:
            json.dump(list(missing_professors), f)
        continue

