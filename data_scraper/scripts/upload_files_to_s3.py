#!/usr/bin/env python3

import pathlib
import os
import boto3

s3 = boto3.client('s3')

feedback_dir = pathlib.Path("backend", "storage", "app", "feedback")
for sub_dir in feedback_dir.iterdir():
    if sub_dir.is_dir():
        links = set()

        for sub_file in sub_dir.iterdir():
            if sub_file.is_file():
                with sub_file.open() as f:
                    file_name = os.path.join(*sub_file.parts[-3:])
                    s3.upload_file(str(sub_file), "uozone-data", file_name)
