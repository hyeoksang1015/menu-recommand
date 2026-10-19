import { INTL_LOCALE, fmt, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/ui";
import type { Menu, ReasonCode } from "@/lib/engine/types";

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

export function reasonLabel(code: ReasonCode, m: Menu, t: Dict): string {
  switch (code) {
    case "hot_match":
      return m.hot ? t.reasons.hot : t.reasons.cold;
    case "heavy_match":
      return m.heavy >= 0.65
        ? t.reasons.heavy
        : m.heavy <= 0.35
          ? t.reasons.light
          : t.reasons.medium;
    default:
      return t.reasons[code];
  }
}
