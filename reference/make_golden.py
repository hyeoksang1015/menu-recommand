"""Generate golden vectors for the TypeScript engine port.

Run from the project root: ``python reference/make_golden.py``. Writes
``tests/golden/{passes,pick_three,shortlist,explain,rejection}.json``.
Each file holds the menus it needs, so every file is self-contained.
"""

import json
import random

from dataclasses import asdict
from pathlib import Path
from typing import Any

from engine import (
    REASONS,
    Menu,
    Query,
    apply_rejection,
    explain,
    passes,
    pick_three,
    shortlist,
)

OUT_DIR = Path(__file__).resolve().parent.parent / "tests" / "golden"
CATEGORIES = ("a", "b", "c", "d", "e", "f", "g", "h")
ALLERGEN_BITS = 9

Case = dict[str, Any]


def menu(
    mid: str,
    cat: int,
    price: int = 9000,
    spice: int = 1,
    heavy: float = 0.5,
    oily: float = 0.5,
    hot: bool = True,
    allergens: int = 0,
) -> Menu:
    """Build a menu for hand-written fixtures.

    Args:
        mid: Menu id.
        cat: Category index into CATEGORIES.
        price: Price in won.
        spice: Spice level.
        heavy: Heaviness.
        oily: Greasiness.
        hot: Served hot.
        allergens: Allergen bitmask.

    Returns:
        The menu.
    """
    return Menu(
        mid,
        mid,
        CATEGORIES[cat],
        1 << cat,
        allergens,
        price,
        spice,
        heavy,
        oily,
        hot,
    )


def tiny_menus() -> list[Menu]:
    """Return a small fixture with ties and repeated categories.

    Returns:
        Menus where t1/t2 tie exactly, t3 shares a category with t1, and
        only three categories exist.
    """
    return [
        menu("t1", 0, heavy=0.8),
        menu("t2", 1, heavy=0.8),
        menu("t3", 0, heavy=0.9, price=15000, oily=0.9),
        menu("t4", 2, heavy=0.2, hot=False, spice=4, allergens=0b1),
        menu("t5", 1, heavy=0.5, hot=False, price=6000, oily=0.2),
        menu("t6", 2, heavy=0.8, spice=0, allergens=0b10),
    ]


def tiny_queries() -> list[tuple[Query, dict[str, float], dict[str, int]]]:
    """Return queries that hit the edge cases on the tiny fixture.

    Returns:
        (query, pref, seen) triples.
    """
    return [
        (Query(), {}, {}),
        (Query(want_heavy=0.8, want_hot=True), {}, {}),
        (Query(want_heavy=0.8), {"b": 0.3}, {"t1": 2}),
        (Query(ban_category=0b100), {}, {}),
        (Query(ban_category=0b110), {}, {}),
        (Query(ban_category=0b111), {}, {}),
        (Query(max_price=8000), {}, {}),
        (Query(max_spice=0, ban_allergen=0b10), {}, {}),
        (Query(recent=frozenset({"t1", "t2"})), {"a": -0.3}, {}),
        (Query(want_hot=False, novel_weight=1.5), {}, {"t5": 1}),
    ]


def random_menus(rng: random.Random, n: int) -> list[Menu]:
    """Build synthetic menus.

    Args:
        rng: Seeded random generator.
        n: How many menus.

    Returns:
        The menus.
    """
    menus = []
    for i in range(n):
        cat = rng.randrange(len(CATEGORIES))
        allergens = 0
        for bit in range(ALLERGEN_BITS):
            if rng.random() < 0.15:
                allergens |= 1 << bit
        menus.append(
            Menu(
                f"m{i:03d}",
                f"menu {i}",
                CATEGORIES[cat],
                1 << cat,
                allergens,
                rng.randrange(5000, 30001, 500),
                rng.randint(0, 5),
                round(rng.random(), 2),
                round(rng.random(), 2),
                rng.random() < 0.6,
            )
        )
    return menus


def random_query(
    rng: random.Random, menus: list[Menu]
) -> tuple[Query, dict[str, float], dict[str, int]]:
    """Build a synthetic query with preference and seen counts.

    Args:
        rng: Seeded random generator.
        menus: Menus to draw recent and seen ids from.

    Returns:
        (query, pref, seen).
    """
    ids = [m.id for m in menus]
    ban_allergen = 0
    if rng.random() < 0.4:
        ban_allergen = 1 << rng.randrange(ALLERGEN_BITS)
    ban_category = 0
    if rng.random() < 0.4:
        ban_category = 1 << rng.randrange(len(CATEGORIES))
    query = Query(
        ban_allergen=ban_allergen,
        ban_category=ban_category,
        max_price=rng.choice([None, 8000, 12000, 20000]),
        max_spice=rng.randint(0, 5),
        max_oily=rng.choice([1.0, 0.7, 0.4]),
        want_heavy=round(rng.random(), 2),
        want_hot=rng.choice([None, True, False]),
        recent=frozenset(rng.sample(ids, rng.randint(0, 5))),
        novel_weight=rng.choice([1.0, 1.0, 1.5]),
    )
    pref = {
        c: round(rng.uniform(-0.6, 0.6), 2)
        for c in rng.sample(CATEGORIES, rng.randint(0, 4))
    }
    seen = {i: rng.randint(1, 4) for i in rng.sample(ids, rng.randint(0, 20))}
    return query, pref, seen


def query_json(q: Query) -> dict[str, Any]:
    """Convert a query to JSON-friendly data.

    Args:
        q: The query.

    Returns:
        A dict with recent as a sorted list.
    """
    data = asdict(q)
    data["recent"] = sorted(q.recent)
    return data


def build_cases(
    datasets: dict[str, list[Menu]],
    queries: list[tuple[str, Query, dict[str, float], dict[str, int]]],
) -> dict[str, list[Case]]:
    """Run every engine function on every query.

    Args:
        datasets: Menus by dataset name.
        queries: (dataset name, query, pref, seen) entries.

    Returns:
        Cases keyed by golden file name.
    """
    out: dict[str, list[Case]] = {
        "passes": [],
        "pick_three": [],
        "shortlist": [],
        "explain": [],
        "rejection": [],
    }
    for name, q, pref, seen in queries:
        menus = datasets[name]
        base = {
            "dataset": name,
            "query": query_json(q),
            "pref": pref,
            "seen": seen,
        }
        out["passes"].append(
            {**base, "ids": [m.id for m in menus if passes(m, q)]}
        )
        picks = pick_three(menus, q, pref, seen)
        out["pick_three"].append(
            {
                **base,
                "picks": [
                    {"slot": p.slot, "id": p.menu.id, "score": p.score}
                    for p in picks
                ],
            }
        )
        out["shortlist"].append(
            {
                **base,
                "k": 12,
                "items": [
                    {"id": m.id, "score": s}
                    for m, s in shortlist(menus, q, pref)
                ],
            }
        )
        for p in picks:
            out["explain"].append(
                {
                    **base,
                    "id": p.menu.id,
                    "slot": p.slot,
                    "reasons": explain(p.menu, q, p.slot, pref, seen),
                }
            )
        if picks:
            target = picks[0].menu
            for reason in REASONS:
                new_q, new_pref = apply_rejection(q, pref, target, reason)
                out["rejection"].append(
                    {
                        **base,
                        "id": target.id,
                        "reason": reason,
                        "new_query": query_json(new_q),
                        "new_pref": new_pref,
                    }
                )
    return out


def main() -> None:
    """Generate all golden files."""
    rng = random.Random(42)
    synthetic = random_menus(rng, 200)
    datasets = {"tiny": tiny_menus(), "synthetic": synthetic}
    queries = [("tiny", q, p, s) for q, p, s in tiny_queries()]
    queries += [
        ("synthetic", *random_query(rng, synthetic)) for _ in range(40)
    ]
    # Rejections must not mutate their inputs.
    q0, p0, _ = queries[2][1:]
    apply_rejection(q0, p0, datasets["tiny"][0], "dislike")
    assert p0 == {"b": 0.3}

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    menus_json = {
        name: [asdict(m) for m in menus] for name, menus in datasets.items()
    }
    for file_name, cases in build_cases(datasets, queries).items():
        payload = {"datasets": menus_json, "cases": cases}
        path = OUT_DIR / f"{file_name}.json"
        path.write_text(json.dumps(payload, ensure_ascii=False) + "\n")
        print(f"{path.name}: {len(cases)} cases")


if __name__ == "__main__":
    main()
