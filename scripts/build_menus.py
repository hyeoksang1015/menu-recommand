"""Convert data/menus.csv to public/menus.json with validation.

Run from the project root: ``python scripts/build_menus.py``. Every
problem is reported with its CSV line number, and the script exits with
status 1 without writing anything if any row is invalid.

Categories and allergens are defined only here; the JSON carries them so
the site reads labels and bits from one place.
"""

import csv
import json
import sys

from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "data" / "menus.csv"
JSON_PATH = ROOT / "public" / "menus.json"

# (key, label, emoji). The list index is the bit position.
CATEGORIES: list[tuple[str, str, str]] = [
    ("korean", "한식", "🍲"),
    ("chinese", "중식", "🥟"),
    ("japanese", "일식", "🍣"),
    ("western", "양식", "🍝"),
    ("snack", "분식", "🍢"),
    ("asian", "아시안", "🍜"),
    ("fastfood", "패스트푸드", "🍔"),
    ("grill", "고기·구이", "🥩"),
]
# (key, label). The list index is the bit position.
ALLERGENS: list[tuple[str, str]] = [
    ("milk", "우유"),
    ("egg", "달걀"),
    ("wheat", "밀"),
    ("soy", "대두"),
    ("nuts", "땅콩·견과"),
    ("crustacean", "새우·게"),
    ("shellfish", "조개류"),
    ("fish", "생선"),
    ("pork", "돼지고기"),
    ("beef", "소고기"),
    ("chicken", "닭고기"),
]
COLUMNS = [
    "id",
    "name",
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
                "name": row["name"].strip(),
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
    if errors:
        print("\n".join(errors), file=sys.stderr)
        print(f"{len(errors)} problem(s); nothing written.", file=sys.stderr)
        return 1
    payload = {
        "categories": [
            {"key": k, "label": label, "emoji": e, "bit": CATEGORY_BIT[k]}
            for k, label, e in CATEGORIES
        ],
        "allergens": [
            {"key": k, "label": label, "bit": ALLERGEN_BIT[k]}
            for k, label in ALLERGENS
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
