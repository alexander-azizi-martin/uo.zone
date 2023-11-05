import unicodedata
import requests
import io
import os
import boto3
import pathlib
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
            except:
                return default


class LocalFilesystem:
    def __init__(self, path) -> None:
        self.pathlib = pathlib.Path(path)

    def put(self, filename: str, data: str) -> str:
        with (self.pathlib / filename).open("r") as f:
            f.write(data)

    def get(self, filename: str, default: str = "") -> str:
        filepath = self.pathlib / filename

        if not filepath.is_file():
            return default

        with filepath.open() as f:
            return f.read()
