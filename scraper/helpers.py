import io
import os
import pathlib
import unicodedata

import boto3
import requests
import tldextract
from PIL import Image


def normalize_string(s: str) -> str:
    normalized_str = (
        unicodedata.normalize("NFKD", s)
        .encode("ascii", "ignore")
        .decode("ascii", "ignore")
    )

    return normalize_whitespace(normalized_str)


def normalize_whitespace(s: str) -> str:
    return " ".join(s.split())


def remove_whitespace(s: str) -> str:
    return s.replace(" ", "")


def download_image(url: str) -> Image:
    response = requests.get(url)

    if response.status_code != 200:
        raise RuntimeError("Could not download image")

    return Image.open(io.BytesIO(response.content))


class AdBlocker:
    def __init__(self) -> None:
        current_directory = os.path.dirname(os.path.abspath(__file__))
        block_list = os.path.join(current_directory, "ublock-origin-blocklist.txt")
        with open(block_list) as f:
            self.blocked_domains = set(domain.strip() for domain in f)

    def is_blocked(self, url: str) -> bool:
        parsed_url = tldextract.extract(url)
        return (
            parsed_url.registered_domain in self.blocked_domains
            or parsed_url.fqdn in self.blocked_domains
        )


class S3Filesystem:
    def __init__(self, bucket) -> None:
        self.s3 = boto3.client("s3")
        self.bucket = bucket

    def put(self, filename: str, data: str) -> str:
        self.s3.upload_fileobj(data.encode(), self.bucket, filename)

    def get(self, filename: str, default: str = "") -> str:
        with io.BytesIO() as buffer:
            try:
                self.s3.download_fileobj(self.bucket, filename, buffer)
                buffer.seek(0)

                return buffer.getvalue().decode()
            except BaseException:
                return default

    def listdir(self, directory: str = "") -> list[str]:
        results = self.s3.list_objects(Bucket=self.bucket, Prefix=directory.strip("/"))
        return [result["key"] for result in results["Contents"]]


class LocalFilesystem:
    def __init__(self, path) -> None:
        self.path = pathlib.Path(path)

    def put(self, filename: str, data: str) -> str:
        file_path = self.path / filename
        file_path.parents[0].mkdir(parents=True, exist_ok=True)

        with file_path.open("w") as f:
            f.write(data)

    def get(self, filename: str, default: str = "") -> str:
        filepath = self.path / filename

        if not filepath.is_file():
            return default

        with filepath.open() as f:
            return f.read()

    def listdir(self, directory: str = "") -> list[str]:
        results = (self.path / directory.strip()).rglob("*")
        return [
            result.as_posix().removeprefix(self.path.as_posix()).strip("/")
            for result in results
            if result.is_file()
        ]
