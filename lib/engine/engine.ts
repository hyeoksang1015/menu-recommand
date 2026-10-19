// reference/engine.py 의 TypeScript 이식. 결과는 tests/golden 골든 벡터와 같아야 한다.
// 동점이면 입력 목록에서 앞선 메뉴가 이긴다(참조 구현과 같은 규칙).
import type {
  Menu,
  Pick,
  Pref,
  Query,
  Reason,
  ReasonCode,
  Seen,
  Slot,
} from "./types";

export const SLOTS: readonly Slot[] = ["safe", "mood", "novel"];
export const REASONS: readonly Reason[] = [
  "ate_recently",
  "too_greasy",
  "too_pricey",
  "dislike",
];
const DISLIKE_PENALTY = 0.3;
const HEAVY_MATCH_GAP = 0.25;
const MAX_REASONS = 3;

export const DEFAULT_QUERY: Query = {
  ban_allergen: 0,
  ban_category: 0,
  max_price: null,
  max_spice: 5,
  max_oily: 1,
  want_heavy: 0.5,
  want_hot: null,
  recent: new Set(),
  novel_weight: 1,
};

// 하드 필터. O(1): 비트 AND와 비교뿐.
export function passes(m: Menu, q: Query): boolean {
  return (
    (m.allergen_mask & q.ban_allergen) === 0 &&
    (m.category_bit & q.ban_category) === 0 &&
    (q.max_price === null || m.price <= q.max_price) &&
    m.spice <= q.max_spice &&
    m.oily <= q.max_oily &&
    !q.recent.has(m.id)
  );
}

export function stateScore(m: Menu, q: Query): number {
  let score = 0.5 * (1 - Math.abs(m.heavy - q.want_heavy));
  if (q.want_hot !== null && m.hot === q.want_hot) score += 0.5;
  return score;
}

export function slotScore(
  m: Menu,
  q: Query,
  slot: Slot,
  pref: Pref,
  seen: Seen,
): number {
  const state = stateScore(m, q);
  if (slot === "safe") return state + (pref[m.category] ?? 0);
  if (slot === "mood") return state;
  return q.novel_weight / (1 + (seen[m.id] ?? 0)) + 0.5 * state;
}

// 슬롯 safe → mood → novel 순으로 1개씩, 앞선 픽과 다른 카테고리에서 고른다.
// O(N): 필터 1회 + 선형 스캔 3회. 후보 카테고리가 3개 미만이면 만들 수 있는 만큼만 반환.
export function pickThree(
  menus: readonly Menu[],
  q: Query,
  pref: Pref,
  seen: Seen,
): Pick[] {
  const candidates = menus.filter((m) => passes(m, q));
  const picks: Pick[] = [];
  let usedBits = 0;
  for (const slot of SLOTS) {
    let best: Menu | null = null;
    let bestScore = -Infinity;
    for (const m of candidates) {
      if (m.category_bit & usedBits) continue;
      const score = slotScore(m, q, slot, pref, seen);
      if (score > bestScore) {
        best = m;
        bestScore = score;
      }
    }
    if (best === null) break;
    picks.push({ slot, menu: best, score: bestScore });
    usedBits |= best.category_bit;
  }
  return picks;
}

// 직접 고르기용 상위 k개(safe 점수). 동점은 입력 순서 유지(안정 정렬).
// shortcut: 정렬 후 자르기라 O(N log N). 참조 구현(heapq, O(N log k))과 결과는 같고 N=250이라 충분하다. 메뉴가 수만 개로 늘면 크기 k 힙으로 바꾼다.
export function shortlist(
  menus: readonly Menu[],
  q: Query,
  pref: Pref,
  k = 12,
): { menu: Menu; score: number }[] {
  return menus
    .filter((m) => passes(m, q))
    .map((menu) => ({ menu, score: slotScore(menu, q, "safe", pref, {}) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

// 실제로 맞는 이유만 우선순위대로 최대 3개. O(1).
export function explain(
  m: Menu,
  q: Query,
  slot: Slot,
  pref: Pref,
  seen: Seen,
): ReasonCode[] {
  const reasons: ReasonCode[] = [];
  if (slot === "safe" && (pref[m.category] ?? 0) > 0)
    reasons.push("liked_category");
  if (slot === "novel" && (seen[m.id] ?? 0) === 0) reasons.push("new_for_you");
  if (q.want_hot !== null && m.hot === q.want_hot) reasons.push("hot_match");
  if (Math.abs(m.heavy - q.want_heavy) <= HEAVY_MATCH_GAP)
    reasons.push("heavy_match");
  if (q.max_price !== null && m.price <= q.max_price) reasons.push("in_budget");
  if (q.max_oily < 1 && m.oily <= q.max_oily) reasons.push("not_greasy");
  return reasons.slice(0, MAX_REASONS);
}

// 거절 사유를 새 쿼리·취향으로 바꾼다. 입력은 바꾸지 않는다.
// 쿼리 필드는 O(1), recent·pref 복사는 O(|recent|)·O(카테고리 수)로 작다.
export function applyRejection(
  q: Query,
  pref: Pref,
  m: Menu,
  reason: string,
): { query: Query; pref: Pref } {
  switch (reason) {
    case "ate_recently":
      return {
        query: { ...q, recent: new Set([...q.recent, m.id]) },
        pref: { ...pref },
      };
    case "too_greasy":
      return { query: { ...q, max_oily: m.oily - 0.1 }, pref: { ...pref } };
    case "too_pricey":
      return { query: { ...q, max_price: m.price - 1 }, pref: { ...pref } };
    case "dislike":
      return {
        query: q,
        pref: {
          ...pref,
          [m.category]: (pref[m.category] ?? 0) - DISLIKE_PENALTY,
        },
      };
    default:
      throw new Error(`unknown rejection reason: ${reason}`);
  }
}
