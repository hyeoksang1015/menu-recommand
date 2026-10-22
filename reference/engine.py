"""Reference recommendation engine (spec section 6).

This module is the source of truth for the TypeScript port in
``lib/engine/``. ``make_golden.py`` runs these functions and stores the
results as golden vectors that the TypeScript tests must reproduce.

Tie-break rule shared with the port: when two menus score the same, the
one that appears earlier in the input list wins.
"""

import heapq
import math

from dataclasses import dataclass, replace
from typing import Literal

Slot = Literal["safe", "mood", "novel"]
Reason = Literal["ate_recently", "too_greasy", "too_pricey", "dislike"]

SLOTS: tuple[Slot, ...] = ("safe", "mood", "novel")
REASONS: tuple[Reason, ...] = (
    "ate_recently",
    "too_greasy",
    "too_pricey",
    "dislike",
)
DISLIKE_PENALTY = 0.3
HEAVY_MATCH_GAP = 0.25
MAX_REASONS = 3


@dataclass(frozen=True)
class Menu:
    """One menu item.

    Attributes:
        id: Stable identifier.
        name: Display name.
        category: Category key.
        category_bit: Single bit that stands for the category.
        allergen_mask: Bitmask of allergens the menu contains.
        price: Typical price in won.
        spice: Spiciness from 0 (none) to 5 (very hot).
        heavy: How filling it is, 0 (light) to 1 (heavy).
        oily: How greasy it is, 0 to 1.
        hot: True when served hot.
        cook_mask: Bitmask of cooking styles (soup, stew, ...).
    """

    id: str
    name: str
    category: str
    category_bit: int
    allergen_mask: int
    price: int
    spice: int
    heavy: float
    oily: float
    hot: bool
    cook_mask: int = 0


@dataclass(frozen=True)
class Query:
    """What the user wants today.

    Attributes:
        ban_allergen: Allergen bits that must not appear.
        ban_category: Category bits that must not appear.
        max_price: Price ceiling in won, or None for no limit.
        max_spice: Spice ceiling, 0 to 5.
        max_oily: Greasiness ceiling, 0 to 1.
        want_heavy: Desired heaviness, 0 to 1.
        want_hot: True or False to prefer hot or cold food, None if any.
        recent: Menu ids to exclude, such as ones eaten recently.
        novel_weight: Weight of the novelty term in the novel slot. The
            "celebration" mood raises it (spec section 7).
        want_cook: Cooking-style bits the user wants; a menu needs at
            least one of them. 0 means any style.
    """

    ban_allergen: int = 0
    ban_category: int = 0
    max_price: int | None = None
    max_spice: int = 5
    max_oily: float = 1.0
    want_heavy: float = 0.5
    want_hot: bool | None = None
    recent: frozenset[str] = frozenset()
    novel_weight: float = 1.0
    want_cook: int = 0


@dataclass(frozen=True)
class Pick:
    """One recommended menu with the slot it filled.

    Attributes:
        slot: Which slot picked it.
        menu: The chosen menu.
        score: Score of the menu in that slot.
    """

    slot: Slot
    menu: Menu
    score: float


def passes(m: Menu, q: Query) -> bool:
    """Check the hard filters.

    Time complexity: O(1); bit operations and comparisons only.

    Args:
        m: Menu to check.
        q: Current query.

    Returns:
        True if the menu satisfies every hard filter.
    """
    return (
        not m.allergen_mask & q.ban_allergen
        and not m.category_bit & q.ban_category
        and (q.max_price is None or m.price <= q.max_price)
        and m.spice <= q.max_spice
        and m.oily <= q.max_oily
        and m.id not in q.recent
        and (not q.want_cook or bool(m.cook_mask & q.want_cook))
    )


def state_score(m: Menu, q: Query) -> float:
    """Score how well a menu fits today's state.

    Args:
        m: Menu to score.
        q: Current query.

    Returns:
        0.5 * heaviness fit, plus 0.5 if the hot/cold wish matches.
        The second term is skipped when want_hot is None.
    """
    score = 0.5 * (1 - abs(m.heavy - q.want_heavy))
    if q.want_hot is not None and m.hot == q.want_hot:
        score += 0.5
    return score


def slot_score(
    m: Menu,
    q: Query,
    slot: Slot,
    pref: dict[str, float],
    seen: dict[str, int],
) -> float:
    """Score a menu for one slot.

    Args:
        m: Menu to score.
        q: Current query.
        slot: Slot being filled.
        pref: Learned preference per category; missing means 0.
        seen: How many times each menu id was shown; missing means 0.

    Returns:
        The slot score from spec section 6.
    """
    state = state_score(m, q)
    if slot == "safe":
        return state + pref.get(m.category, 0.0)
    if slot == "mood":
        return state
    return q.novel_weight / (1 + seen.get(m.id, 0)) + 0.5 * state


def pick_three(
    menus: list[Menu],
    q: Query,
    pref: dict[str, float],
    seen: dict[str, int],
) -> list[Pick]:
    """Pick up to three menus, one per slot, each from a new category.

    Time complexity: O(N); one filter pass plus three linear scans.

    Args:
        menus: All menus.
        q: Current query.
        pref: Learned preference per category.
        seen: Show counts per menu id.

    Returns:
        Picks in slot order safe, mood, novel. Fewer than three when
        the candidates cover fewer categories.
    """
    candidates = [m for m in menus if passes(m, q)]
    picks: list[Pick] = []
    used_bits = 0
    for slot in SLOTS:
        best: Menu | None = None
        best_score = -math.inf
        for m in candidates:
            if m.category_bit & used_bits:
                continue
            score = slot_score(m, q, slot, pref, seen)
            if score > best_score:
                best, best_score = m, score
        if best is None:
            break
        picks.append(Pick(slot, best, best_score))
        used_bits |= best.category_bit
    return picks


def shortlist(
    menus: list[Menu],
    q: Query,
    pref: dict[str, float],
    k: int = 12,
) -> list[tuple[Menu, float]]:
    """Return the top k candidates for browsing by safe score.

    Time complexity: O(N log k) with a size-k heap.

    Args:
        menus: All menus.
        q: Current query.
        pref: Learned preference per category.
        k: How many to return.

    Returns:
        (menu, score) pairs, best first. Ties keep the input order.
    """
    scored = (
        (m, slot_score(m, q, "safe", pref, {})) for m in menus if passes(m, q)
    )
    return heapq.nlargest(k, scored, key=_second)


def _second(pair: tuple[Menu, float]) -> float:
    """Return the score part of a (menu, score) pair.

    Args:
        pair: A (menu, score) pair.

    Returns:
        The score.
    """
    return pair[1]


def explain(
    m: Menu,
    q: Query,
    slot: Slot,
    pref: dict[str, float],
    seen: dict[str, int],
) -> list[str]:
    """List reason codes that are actually true for a pick.

    Time complexity: O(1).

    Args:
        m: The picked menu.
        q: Query used for the pick.
        slot: Slot the menu filled.
        pref: Learned preference per category.
        seen: Show counts per menu id, before this pick was shown.

    Returns:
        Up to three codes in priority order: slot reason
        (liked_category or new_for_you), hot_match, heavy_match,
        in_budget, not_greasy.
    """
    reasons: list[str] = []
    if slot == "safe" and pref.get(m.category, 0.0) > 0:
        reasons.append("liked_category")
    if slot == "novel" and seen.get(m.id, 0) == 0:
        reasons.append("new_for_you")
    if q.want_hot is not None and m.hot == q.want_hot:
        reasons.append("hot_match")
    if abs(m.heavy - q.want_heavy) <= HEAVY_MATCH_GAP:
        reasons.append("heavy_match")
    if q.max_price is not None and m.price <= q.max_price:
        reasons.append("in_budget")
    if q.max_oily < 1.0 and m.oily <= q.max_oily:
        reasons.append("not_greasy")
    return reasons[:MAX_REASONS]


def apply_rejection(
    q: Query,
    pref: dict[str, float],
    m: Menu,
    reason: str,
) -> tuple[Query, dict[str, float]]:
    """Turn a rejection into a new query and preference.

    The inputs are not modified. Time complexity: O(1) for the query
    fields; copying recent and pref is O(|recent|) and O(categories),
    both small.

    Args:
        q: Query that produced the rejected menu.
        pref: Learned preference per category.
        m: The rejected menu.
        reason: One of REASONS.

    Returns:
        (new query, new pref).

    Raises:
        ValueError: If reason is not one of REASONS.
    """
    if reason == "ate_recently":
        return replace(q, recent=q.recent | {m.id}), dict(pref)
    if reason == "too_greasy":
        return replace(q, max_oily=m.oily - 0.1), dict(pref)
    if reason == "too_pricey":
        return replace(q, max_price=m.price - 1), dict(pref)
    if reason == "dislike":
        new_pref = dict(pref)
        new_pref[m.category] = pref.get(m.category, 0.0) - DISLIKE_PENALTY
        return q, new_pref
    raise ValueError(f"unknown rejection reason: {reason}")
