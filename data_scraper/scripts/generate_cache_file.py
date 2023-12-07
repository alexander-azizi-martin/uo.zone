#!/usr/bin/env python3

import json
import re
from collections import defaultdict

from data_scraper.settings import filesystem

SEASON_PATTERN = r"(winter|summer|fall) \d{4}"

saved_surveys = defaultdict(list)

for survey_file in filesystem.listdir("surveys"):
    season_match = re.search(SEASON_PATTERN, survey_file)

    if season_match is None or survey_file.endswith(".cache.json"):
        continue

    season = season_match.group(0)
    data = json.loads(filesystem.get(survey_file))
    saved_surveys[season].append(data["link"])

for season in saved_surveys:
    data = json.dumps(saved_surveys[season])
    filesystem.put(f"surveys/{season}/.cache.json", data)
