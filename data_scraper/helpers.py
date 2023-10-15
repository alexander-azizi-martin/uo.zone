import unicodedata
import requests
import io
from PIL import Image


def normalize_string(s: str):
    normalized = unicodedata.normalize("NFKD", s)
    return normalized.encode("ascii", "ignore").decode("ascii", "ignore").strip()


def normalize_whitespace(s: str):
    return " ".join(s.split())


def download_image(url: str) -> Image:
    response = requests.get(url)

    if response.status_code != 200:
        raise RuntimeError("Could not download image")

    return Image.open(io.BytesIO(response.content))
