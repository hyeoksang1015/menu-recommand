"""Find and download free-licensed menu photos from Wikimedia Commons.

Run from the project root:

    python scripts/fetch_photos.py               # fill gaps, download
    python scripts/fetch_photos.py --candidates ID [QUERY]

The first form searches Commons for every menu that has no row in
data/photos.csv, appends the first usable result, then downloads every
row whose public/photos/{id}.webp is missing (refreshing its credit
from Commons). To replace a wrong photo, put another Commons file name
in its row, delete the webp and run again. A row whose file is "-"
means "no photo on purpose" and is never searched or downloaded. The
second form only prints search candidates so a person can pick one.
"""

import csv
import html
import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request

from pathlib import Path
from typing import Any

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MENUS_CSV = ROOT / "data" / "menus.csv"
PHOTOS_CSV = ROOT / "data" / "photos.csv"
PHOTO_DIR = ROOT / "public" / "photos"
COLUMNS = ["id", "file", "author", "license", "license_url"]
API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = (
    "menu-recommand/0.2 (https://github.com/hyeoksang1015/menu-recommand)"
)
# Licenses that allow reuse on a commercial site with attribution.
ALLOWED = re.compile(r"^(CC0|Public domain|CC BY(-SA)? \d\.\d.*)$", re.I)
NO_PHOTO = "-"
THUMB_WIDTH = 960
SIZE = (480, 360)
PAUSE_S = 0.3


def api(params: dict[str, str]) -> dict[str, Any]:
    """Call the Commons API.

    Args:
        params: Query parameters without format.

    Returns:
        The decoded JSON response.
    """
    query = urllib.parse.urlencode({**params, "format": "json"})
    request = urllib.request.Request(
        f"{API}?{query}", headers={"User-Agent": USER_AGENT}
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def plain(text: str) -> str:
    """Strip HTML tags and entities from a Commons metadata value.

    Args:
        text: HTML snippet.

    Returns:
        Plain text on one line.
    """
    return " ".join(html.unescape(re.sub(r"<[^>]+>", "", text)).split())


def credit(page: dict[str, Any]) -> dict[str, str] | None:
    """Turn an imageinfo page into a credit row if it is usable.

    Args:
        page: A page object with imageinfo from the API.

    Returns:
        {file, author, license, license_url, thumb}, or None when the
        file is not a large enough JPEG under an allowed license.
    """
    info = (page.get("imageinfo") or [{}])[0]
    meta = info.get("extmetadata", {})
    license_name = plain(meta.get("LicenseShortName", {}).get("value", ""))
    if (
        info.get("mime") != "image/jpeg"
        or info.get("width", 0) < SIZE[0] * 1.3
        or not ALLOWED.match(license_name)
    ):
        return None
    author = plain(meta.get("Artist", {}).get("value", "")) or "Unknown"
    return {
        "file": page["title"].removeprefix("File:"),
        "author": author[:120],
        "license": license_name,
        "license_url": meta.get("LicenseUrl", {}).get("value")
        or info["descriptionurl"],
        "thumb": info["thumburl"],
    }


IMAGEINFO = {
    "prop": "imageinfo",
    "iiprop": "url|extmetadata|size|mime",
    "iiurlwidth": str(THUMB_WIDTH),
}


def search(query: str, limit: int = 10) -> list[dict[str, str]]:
    """Search Commons files and keep usable ones in search order.

    Args:
        query: Search words.
        limit: How many results to inspect.

    Returns:
        Usable credit rows, best match first.
    """
    data = api(
        {
            "action": "query",
            "generator": "search",
            "gsrnamespace": "6",
            "gsrsearch": f"{query} filetype:bitmap",
            "gsrlimit": str(limit),
            **IMAGEINFO,
        }
    )
    pages = sorted(
        data.get("query", {}).get("pages", {}).values(),
        key=lambda p: p.get("index", 0),
    )
    return [c for c in map(credit, pages) if c]


def lookup(file: str) -> dict[str, str] | None:
    """Fetch the credit row of one Commons file.

    Args:
        file: File name without the "File:" prefix.

    Returns:
        The credit row, or None if the file is missing or unusable.
    """
    data = api({"action": "query", "titles": f"File:{file}", **IMAGEINFO})
    pages = list(data.get("query", {}).get("pages", {}).values())
    return credit(pages[0]) if pages else None


def save_webp(url: str, path: Path) -> None:
    """Download an image, crop it to 4:3 around the center, save as webp.

    Args:
        url: Image URL.
        path: Output .webp path.
    """
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        image = Image.open(io.BytesIO(response.read())).convert("RGB")
    width, height = image.size
    target = SIZE[0] / SIZE[1]
    if width / height > target:
        crop = int(height * target)
        box = ((width - crop) // 2, 0, (width + crop) // 2, height)
    else:
        crop = int(width / target)
        box = (0, (height - crop) // 2, width, (height + crop) // 2)
    image = image.crop(box).resize(SIZE, Image.Resampling.LANCZOS)
    image.save(path, "WEBP", quality=72, method=6)


def read_csv(path: Path) -> list[dict[str, str]]:
    """Read a CSV file into dict rows.

    Args:
        path: CSV path; a missing file reads as no rows.

    Returns:
        The rows.
    """
    if not path.exists():
        return []
    with path.open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_photos(rows: list[dict[str, str]]) -> None:
    """Write data/photos.csv.

    Args:
        rows: Credit rows; extra keys are dropped.
    """
    with PHOTOS_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main(argv: list[str]) -> int:
    """Run the fill-and-download pass or print candidates.

    Args:
        argv: Command-line arguments without the program name.

    Returns:
        Process exit status.
    """
    # Commons file names are not all representable in the Windows console.
    sys.stdout.reconfigure(encoding="utf-8")
    menus = {m["id"]: m for m in read_csv(MENUS_CSV)}
    if argv[:1] == ["--candidates"] and len(argv) >= 2:
        query = " ".join(argv[2:]) or menus[argv[1]]["name_en"]
        for c in search(query, limit=20):
            print(f"{c['file']} | {c['license']} | {c['author']}")
        return 0

    rows = read_csv(PHOTOS_CSV)
    known = {r["id"] for r in rows}
    for menu_id, menu in menus.items():
        if menu_id in known:
            continue
        found = search(menu["name_en"])
        time.sleep(PAUSE_S)
        if found:
            rows.append({"id": menu_id, **found[0]})
            print(f"picked {menu_id}: {found[0]['file']}")
        else:
            print(f"no photo for {menu_id}")
    rows.sort(key=lambda r: list(menus).index(r["id"]))
    write_photos(rows)

    PHOTO_DIR.mkdir(parents=True, exist_ok=True)
    failed = 0
    for row in rows:
        path = PHOTO_DIR / f"{row['id']}.webp"
        if row["file"] == NO_PHOTO or path.exists():
            continue
        fresh = lookup(row["file"])
        time.sleep(PAUSE_S)
        if fresh is None:
            print(f"unusable file for {row['id']}: {row['file']}")
            failed += 1
            continue
        row.update(fresh)
        save_webp(fresh["thumb"], path)
        print(f"saved {path.name}")
    write_photos(rows)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
