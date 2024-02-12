import bisect
import itertools

import pandas as pd

grade_values = {
    "A+": 10,
    "A": 9,
    "A-": 8,
    "B+": 7,
    "B": 6,
    "C+": 5,
    "C": 4,
    "D+": 3,
    "D": 2,
    "E": 1,
    "F": 0,
    "EIN": 0,
    "NS": 0,
    "NC": 0,
    "ABS": 0,
    "P": 0,
    "S": 0,
}

season_to_num = {
    "winter": 0,
    "1": 0,
    "summer": 1,
    "5": 1,
    "fall": 2,
    "9": 2,
}


def calculate_mean(course):
    return sum(
        (grade_values[grade] * course[grade]) / course["total"]
        for grade in grade_values
    )


def calculate_median(course):
    grades = list(grade_values.keys())
    grade_occurrences = list(itertools.accumulate(course[grades]))
    median_i = bisect.bisect_left(grade_occurrences, course["total"] / 2)
    return grades[median_i]


def calculate_mode(course):
    grades = list(grade_values.keys())
    return max(grades, key=lambda grade: course[grade])


def transform_term(term):
    term = str(term)

    year = 2000 + int(term[1:3])
    season = season_to_num[term[-1]]

    return (year * 10) + season


grade_data = pd.read_csv("scrapped_data/grade_data.csv", low_memory=False)
grade_data.columns = [
    column if column in grade_values else column.lower()
    for column in grade_data.columns
]

grade_data = (
    grade_data.groupby(["term", "course", "section"])
    .agg({grade: "sum" for grade in grade_values} | {"total": "sum"})
    .reset_index()
)

grade_data["mean"] = grade_data.apply(calculate_mean, axis=1)
grade_data["median"] = grade_data.apply(calculate_median, axis=1)
grade_data["mode"] = grade_data.apply(calculate_mode, axis=1)
grade_data["term_id"] = grade_data["term"].apply(transform_term)

grade_data.to_csv("scrapped_data/processed_grade_data.csv", index=False)
