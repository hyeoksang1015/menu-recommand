"""Convert data/menus.csv to public/menus.json with validation.

Run from the project root: ``python scripts/build_menus.py``. Every
problem is reported with its CSV line number, and the script exits with
status 1 without writing anything if any row is invalid.

Categories and allergens are defined only here; the JSON carries them so
the site reads labels and bits from one place. Photo credits come from
data/photos.csv (written by fetch_photos.py); a menu gets a photo only if
its webp file exists in public/photos/.
"""

import csv
import json
import sys

from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "data" / "menus.csv"
JSON_PATH = ROOT / "public" / "menus.json"
PHOTOS_CSV = ROOT / "data" / "photos.csv"
PHOTO_DIR = ROOT / "public" / "photos"
PHOTO_COLUMNS = ["id", "file", "author", "license", "license_url"]

# Site languages. The CSV has name (ko) plus name_<lang> for the others.
LOCALES = ("ko", "en", "ja", "zh")
NAME_COLUMNS = ["name"] + [f"name_{lang}" for lang in LOCALES[1:]]

# (key, emoji, labels in LOCALES order). The list index is the bit.
CATEGORIES: list[tuple[str, str, tuple[str, ...]]] = [
    ("korean", "🍲", ("한식", "Korean", "韓国料理", "韩餐")),
    ("chinese", "🥟", ("중식", "Chinese", "中華料理", "中餐")),
    ("japanese", "🍣", ("일식", "Japanese", "和食", "日料")),
    ("western", "🍝", ("양식", "Western", "洋食", "西餐")),
    ("snack", "🍢", ("분식", "Korean Snacks", "粉食", "韩式小吃")),
    ("asian", "🍜", ("아시안", "Asian", "アジア料理", "亚洲菜")),
    ("fastfood", "🍔", ("패스트푸드", "Fast Food", "ファストフード", "快餐")),
    ("grill", "🥩", ("고기·구이", "BBQ & Grill", "焼肉・グリル", "烤肉")),
]
# (key, labels in LOCALES order). The list index is the bit position.
ALLERGENS: list[tuple[str, tuple[str, ...]]] = [
    ("milk", ("우유", "Milk", "乳", "牛奶")),
    ("egg", ("달걀", "Egg", "卵", "鸡蛋")),
    ("wheat", ("밀", "Wheat", "小麦", "小麦")),
    ("soy", ("대두", "Soy", "大豆", "大豆")),
    ("nuts", ("땅콩·견과", "Peanuts & nuts", "落花生・ナッツ", "花生·坚果")),
    ("crustacean", ("새우·게", "Shrimp & crab", "エビ・カニ", "虾·蟹")),
    (
        "shellfish",
        ("조개·오징어류", "Shellfish & squid", "貝・イカ", "贝类·鱿鱼"),
    ),
    ("fish", ("생선", "Fish", "魚", "鱼")),
    ("pork", ("돼지고기", "Pork", "豚肉", "猪肉")),
    ("beef", ("소고기", "Beef", "牛肉", "牛肉")),
    ("chicken", ("닭고기", "Chicken", "鶏肉", "鸡肉")),
]
COLUMNS = [
    "id",
    *NAME_COLUMNS,
    "category",
    "allergens",
    "price",
    "spice",
    "heavy",
    "oily",
    "hot",
]
CATEGORY_BIT = {key: 1 << i for i, (key, _, _) in enumerate(CATEGORIES)}
ALLERGEN_BIT = {key: 1 << i for i, (key, _) in enumerate(ALLERGENS)}


def labels(names: tuple[str, ...]) -> dict[str, str]:
    """Map label tuples to {locale: label}.

    Args:
        names: Labels in LOCALES order.

    Returns:
        Labels keyed by locale.
    """
    return dict(zip(LOCALES, names, strict=True))


def parse_rows(
    rows: list[dict[str, str]],
) -> tuple[list[dict[str, Any]], list[str]]:
    """Validate CSV rows and convert them to menu records.

    Time complexity: O(N); one pass with a set for duplicate ids.

    Args:
        rows: Rows from csv.DictReader. Row i is on CSV line i + 2.

    Returns:
        (menus, errors). errors is empty when every row is valid.
    """
    menus: list[dict[str, Any]] = []
    errors: list[str] = []
    seen_ids: set[str] = set()
    for index, row in enumerate(rows):
        line = index + 2
        problems: list[str] = []
        missing = [c for c in COLUMNS if c != "allergens" and not row.get(c)]
        if missing:
            errors.append(f"line {line}: missing {', '.join(missing)}")
            continue
        menu_id = row["id"].strip()
        if menu_id in seen_ids:
            problems.append(f"duplicate id {menu_id!r}")
        seen_ids.add(menu_id)
        category = row["category"].strip()
        if category not in CATEGORY_BIT:
            problems.append(f"unknown category {category!r}")
        mask = 0
        for name in filter(None, (row.get("allergens") or "").split("|")):
            if name.strip() not in ALLERGEN_BIT:
                problems.append(f"unknown allergen {name!r}")
            else:
                mask |= ALLERGEN_BIT[name.strip()]
        price = _int(row["price"])
        if price is None or price <= 0:
            problems.append(
                f"price must be a positive integer: {row['price']}"
            )
        spice = _int(row["spice"])
        if spice is None or not 0 <= spice <= 5:
            problems.append(f"spice must be an integer 0-5: {row['spice']}")
        heavy = _unit(row["heavy"])
        if heavy is None:
            problems.append(f"heavy must be 0-1: {row['heavy']}")
        oily = _unit(row["oily"])
        if oily is None:
            problems.append(f"oily must be 0-1: {row['oily']}")
        hot = row["hot"].strip()
        if hot not in ("0", "1"):
            problems.append(f"hot must be 0 or 1: {row['hot']}")
        if problems:
            errors.extend(f"line {line}: {p}" for p in problems)
            continue
        menus.append(
            {
                "id": menu_id,
                **{c: row[c].strip() for c in NAME_COLUMNS},
                "category": category,
                "category_bit": CATEGORY_BIT[category],
                "allergen_mask": mask,
                "price": price,
                "spice": spice,
                "heavy": heavy,
                "oily": oily,
                "hot": hot == "1",
            }
        )
    return menus, errors


def attach_photos(
    menus: list[dict[str, Any]],
    rows: list[dict[str, str]],
    photo_dir: Path = PHOTO_DIR,
) -> list[str]:
    """Add photo credits to menus whose webp file exists.

    Time complexity: O(N + P) with a dict lookup per photo row.

    Args:
        menus: Parsed menus; each gets a "photo" key (dict or None).
        rows: Rows of data/photos.csv. Row i is on CSV line i + 2.
        photo_dir: Folder holding {id}.webp files.

    Returns:
        Error messages; empty when every row is usable.
    """
    by_id = {m["id"]: m for m in menus}
    for m in menus:
        m["photo"] = None
    errors: list[str] = []
    for index, row in enumerate(rows):
        line = index + 2
        missing = [c for c in PHOTO_COLUMNS if not row.get(c)]
        if missing:
            errors.append(f"photos line {line}: missing {', '.join(missing)}")
            continue
        menu = by_id.get(row["id"])
        if menu is None:
            errors.append(f"photos line {line}: unknown id {row['id']!r}")
            continue
        if (photo_dir / f"{row['id']}.webp").exists():
            menu["photo"] = {c: row[c] for c in PHOTO_COLUMNS[1:]}
    return errors


def _int(text: str) -> int | None:
    """Parse an integer.

    Args:
        text: Raw cell.

    Returns:
        The integer, or None if the cell is not an integer.
    """
    try:
        return int(text.strip())
    except ValueError:
        return None


def _unit(text: str) -> float | None:
    """Parse a number between 0 and 1.

    Args:
        text: Raw cell.

    Returns:
        The number, or None if it is not a number in [0, 1].
    """
    try:
        value = float(text.strip())
    except ValueError:
        return None
    return value if 0 <= value <= 1 else None


def main() -> int:
    """Build public/menus.json.

    Returns:
        Process exit status.
    """
    with CSV_PATH.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames != COLUMNS:
            print(f"header must be: {','.join(COLUMNS)}", file=sys.stderr)
            return 1
        menus, errors = parse_rows(list(reader))
    photo_rows: list[dict[str, str]] = []
    if PHOTOS_CSV.exists():
        with PHOTOS_CSV.open(encoding="utf-8-sig", newline="") as f:
            photo_rows = list(csv.DictReader(f))
    errors += attach_photos(menus, photo_rows)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        print(f"{len(errors)} problem(s); nothing written.", file=sys.stderr)
        return 1
    payload = {
        "locales": list(LOCALES),
        "categories": [
            {
                "key": k,
                "emoji": e,
                "bit": CATEGORY_BIT[k],
                "label": labels(names),
            }
            for k, e, names in CATEGORIES
        ],
        "allergens": [
            {"key": k, "bit": ALLERGEN_BIT[k], "label": labels(names)}
            for k, names in ALLERGENS
        ],
        "menus": menus,
    }
    JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    JSON_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=1) + "\n",
        encoding="utf-8",
    )
    print(f"{JSON_PATH.name}: {len(menus)} menus")
    return 0


if __name__ == "__main__":
    sys.exit(main())
