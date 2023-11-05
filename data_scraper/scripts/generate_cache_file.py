#!/usr/bin/env python3

import pathlib
import json

feedback_dir = pathlib.Path("backend", "storage", "app", "feedback")
for sub_dir in feedback_dir.iterdir():
    if sub_dir.is_dir():
        links = set()

        for sub_file in sub_dir.iterdir():
            if sub_file.is_file() and sub_file.name != '.cache.json':
                with sub_file.open() as f:
                    links.add(json.load(f)["link"])

        with (sub_dir / ".cache.json").open("w") as f:
            json.dump(list(links), f)
