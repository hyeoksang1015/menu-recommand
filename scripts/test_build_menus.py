"""Tests for build_menus parsing, photo merging and the committed CSV."""

import csv
import tempfile
import unittest

from pathlib import Path

from build_menus import CSV_PATH, attach_photos, parse_rows

VALID = {
    "id": "x",
    "name": "테스트",
    "name_en": "Test",
    "name_ja": "テスト",
    "name_zh": "测试",
    "category": "korean",
    "allergens": "egg|soy",
    "price": "9000",
    "spice": "2",
    "heavy": "0.5",
    "oily": "0.3",
    "hot": "1",
}


def errors_for(**changes: str) -> list[str]:
    """Return parse errors for VALID with some cells changed.

    Args:
        **changes: Cells to override.

    Returns:
        The error messages.
    """
    return parse_rows([{**VALID, **changes}])[1]


class ParseRowsTest(unittest.TestCase):
    """parse_rows accepts good rows and rejects bad values."""

    def test_valid_row(self) -> None:
        """A valid row becomes a menu with computed bits."""
        menus, errors = parse_rows([VALID])
        self.assertEqual(errors, [])
        self.assertEqual(menus[0]["category_bit"], 1)
        self.assertEqual(menus[0]["allergen_mask"], 0b1010)
        self.assertIs(menus[0]["hot"], True)

    def test_spice_out_of_range(self) -> None:
        """Spice 7 fails with the CSV line number."""
        self.assertEqual(
            errors_for(spice="7"), ["line 2: spice must be an integer 0-5: 7"]
        )

    def test_bad_values(self) -> None:
        """Each invalid cell is reported."""
        for cells in (
            {"category": "dessert"},
            {"allergens": "egg|gluten"},
            {"price": "0"},
            {"price": "9천"},
            {"spice": "1.5"},
            {"heavy": "1.5"},
            {"oily": "-0.1"},
            {"hot": "yes"},
            {"name": ""},
            {"name_ja": ""},
        ):
            with self.subTest(cells=cells):
                self.assertEqual(len(errors_for(**cells)), 1)

    def test_duplicate_id(self) -> None:
        """A repeated id is reported on its second line."""
        errors = parse_rows([VALID, VALID])[1]
        self.assertEqual(errors, ["line 3: duplicate id 'x'"])

    def test_attach_photos(self) -> None:
        """Only rows with an existing webp become photos; bad ids fail."""
        menus = parse_rows([VALID, {**VALID, "id": "y"}])[0]
        credit = {"author": "A", "license": "CC0", "license_url": "u"}
        rows = [
            {"id": "x", "file": "x.jpg", **credit},
            {"id": "y", "file": "y.jpg", **credit},
            {"id": "z", "file": "z.jpg", **credit},
        ]
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "x.webp").touch()
            errors = attach_photos(menus, rows, Path(tmp))
        self.assertEqual(errors, ["photos line 4: unknown id 'z'"])
        self.assertEqual(menus[0]["photo"], {"file": "x.jpg", **credit})
        self.assertIsNone(menus[1]["photo"])

    def test_committed_csv_is_valid(self) -> None:
        """data/menus.csv has no problems."""
        with CSV_PATH.open(encoding="utf-8-sig", newline="") as f:
            self.assertEqual(parse_rows(list(csv.DictReader(f)))[1], [])


if __name__ == "__main__":
    unittest.main()
