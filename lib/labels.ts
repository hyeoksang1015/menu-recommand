import { INTL_LOCALE, fmt, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/ui";
import type { Inputs } from "@/config/mood";
import type { Menu, Query, ReasonCode, Slot } from "@/lib/engine/types";
import { CATEGORY_BY_KEY, COOKINGS } from "@/lib/menus";

// 엔진 코드·숫자 → 화면 문구. 문구 자체는 i18n/ui 사전에 있다.

export function won(n: number, lang: Locale): string {
  if (lang === "ko") return `${n.toLocaleString("ko-KR")}원`;
  return new Intl.NumberFormat(INTL_LOCALE[lang], {
    style: "currency",
    currency: "KRW",
  }).format(n);
}

// 한국어 예산 슬라이더는 "1만 5천 원"처럼 읽기 쉬운 단위로 보여 준다.
export function budgetLabel(n: number, lang: Locale): string {
  if (lang !== "ko") return won(n, lang);
  const man = Math.floor(n / 10000);
  const rest = (n % 10000) / 1000;
  return `${man ? `${man}만` : ""}${rest ? ` ${rest}천` : ""} 원`.trim();
}

export const priceLabel = (m: Menu, lang: Locale, t: Dict) =>
  fmt(t.menu.price, { price: won(m.price, lang) });

// 카드의 "왜 이 메뉴?" 문장. 엔진이 준 이유 코드(실제로 맞아떨어진 것만)에 사용자가 고른 조건을 되짚어 붙인다.
// 내가 말한 걸 들었다는 느낌이 들어야 납득이 되므로 입력을 그대로 언급하고, 지어낸 근거는 넣지 않는다.
// 되짚는 문장은 카드마다 반복되면 기계적으로 읽히므로 said(앞 카드에서 쓴 문장)에 있으면 메뉴 자체의 사실로 바꾼다.
export function whyLines(
  codes: readonly ReasonCode[],
  m: Menu,
  slot: Slot,
  inputs: Inputs,
  q: Query,
  lang: Locale,
  t: Dict,
  said: Set<string>,
): string[] {
  const r = t.reasons;
  const once = (line: string, plain: string | null) => {
    if (said.has(line)) return plain;
    said.add(line);
    return line;
  };
  const size = m.heavy >= 0.65 ? "heavy" : m.heavy <= 0.35 ? "light" : "medium";
  const lines = codes.map((code) => {
    switch (code) {
      case "hot_match":
        if (m.hot && inputs.mood === "tired") return once(r.hotTired, r.hot);
        if (m.hot && inputs.season === "winter")
          return once(r.season.winter, r.hot);
        if (!m.hot && inputs.season === "summer")
          return once(r.season.summer, r.cold);
        return m.hot ? r.hot : r.cold;
      case "heavy_match":
        if (inputs.hunger !== null) return once(r.asked[size], r[size]);
        if (
          (inputs.mood === "tired" || inputs.mood === "stress") &&
          m.heavy >= 0.55
        )
          return once(r.mood[inputs.mood], r[size]);
        return r[size];
      case "in_budget": {
        // 거절("비쌈")로 예산이 내려간 경우
        if (q.max_price !== inputs.budget || q.max_price === null)
          return once(r.cheaper, null);
        const left = q.max_price - m.price;
        return fmt(left > 0 ? r.in_budget : r.budgetExact, {
          budget: budgetLabel(q.max_price, lang),
          left: won(left, lang),
        });
      }
      case "liked_category":
        return fmt(r.liked_category, {
          category: CATEGORY_BY_KEY.get(m.category)?.label[lang] ?? "",
        });
      case "not_greasy":
        return once(r.not_greasy, null);
      default:
        return r[code];
    }
  });
  if (slot === "novel" && inputs.mood === "celebrate") lines.push(r.celebrate);
  // 조리방식은 사용자가 직접 고른 조건이라 맨 앞에 둔다. 이 메뉴가 해당하는 고른 방식 하나를 말한다.
  const cook = COOKINGS.find(
    (c) => inputs.cookings.includes(c.key) && (m.cook_mask & c.bit) !== 0,
  );
  if (cook) lines.unshift(once(fmt(r.cook, { cook: cook.label[lang] }), null));
  return lines.filter((l) => l !== null);
}
