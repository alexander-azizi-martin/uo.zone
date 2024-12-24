import bisect
import itertools
import os

import pandas as pd

GRADE_VALUES = {
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

SEASON_TO_NUM = {
    "winter": 0,
    "1": 0,
    "summer": 1,
    "5": 1,
    "fall": 2,
    "9": 2,
}

GRADE_DIR = "static/grades"


def calculate_mean(course):
    if course["total"] == 0:
        return None

    return sum(
        (GRADE_VALUES[grade] * course[grade]) / course["total"]
        for grade in GRADE_VALUES
    )


def calculate_median(course):
    grades = list(GRADE_VALUES.keys())
    grade_occurrences = list(itertools.accumulate(course[grades]))
    median_i = bisect.bisect_left(grade_occurrences, course["total"] / 2)
    return grades[median_i]


def calculate_mode(course):
    grades = list(GRADE_VALUES.keys())
    return max(grades, key=lambda grade: course[grade])


def transform_term(term):
    term = str(term)

    year = 2000 + int(term[1:3])
    season = SEASON_TO_NUM[term[-1]]

    return (year * 10) + season


grade_dfs = []
for grade_file in os.listdir(GRADE_DIR):
    grade_df = pd.read_csv(f"{GRADE_DIR}/{grade_file}", low_memory=False)
    grade_df.columns = [
        column if column in GRADE_VALUES else column.lower()
        for column in grade_df.columns
    ]

    for column in GRADE_VALUES:
        if column not in grade_df.columns:
            grade_df[column] = 0.0

    grade_df["term_id"] = grade_df["term"].apply(transform_term)
    grade_df = (
        grade_df.groupby(["term_id", "course", "section"])
        .agg({grade: "sum" for grade in GRADE_VALUES})
        .reset_index()
    )

    grade_dfs.append(grade_df)

pd.concat(grade_dfs).to_csv("static/processed_grade_data.csv", index=False)
