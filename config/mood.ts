import { DEFAULT_QUERY } from "@/lib/engine/engine";
import type { Query } from "@/lib/engine/types";
import { ALLERGENS, CATEGORIES } from "@/lib/menus";

// 홈 입력 → 엔진 Query 변환. 기분 매핑은 가설(spec 7절)이라 사용자 테스트 뒤 이 파일에서만 고친다.

export type Mood = "any" | "stress" | "tired" | "normal" | "celebrate";
export type Company = "any" | "solo" | "two" | "group";

// 칩 순서. 화면 문구는 i18n/ui 사전의 home.moods / home.companies 에 있다.
export const MOOD_KEYS: Mood[] = [
  "any",
  "stress",
  "tired",
  "normal",
  "celebrate",
];
export const COMPANY_KEYS: Company[] = ["any", "solo", "two", "group"];

// 기분이 정하는 기본값. 허기 슬라이더를 직접 움직였으면 want_heavy는 슬라이더 값을 쓴다.
const MOOD_QUERY: Record<Mood, Partial<Query>> = {
  any: {},
  normal: {},
  tired: { want_heavy: 0.8, want_hot: true },
  stress: { want_heavy: 0.7, max_spice: 5 },
  // 예산은 슬라이더 그대로 두고 새로운 메뉴 쪽을 올린다.
  celebrate: { novel_weight: 1.5 },
};

export interface Inputs {
  hunger: number | null; // 0(가볍게)~1(든든하게), null이면 상관없어
  mood: Mood;
  company: Company; // 1단계에서는 저장만 하고 필터에 쓰지 않는다(메뉴에 동행 필드가 없음).
  budget: number | null; // 원, null이면 상관없어
  banAllergens: string[];
  banCategories: string[];
}

export interface Eaten {
  id: string;
  at: number; // 먹은 시각(ms). "어제 먹음"은 하루 전 시각으로 기록한다.
}

export const DEFAULT_INPUTS: Inputs = {
  hunger: null,
  mood: "any",
  company: "any",
  budget: null,
  banAllergens: [],
  banCategories: [],
};

export const RECENT_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

export function recentIds(eaten: readonly Eaten[], now: number): Set<string> {
  return new Set(
    eaten.filter((e) => now - e.at < RECENT_WINDOW_MS).map((e) => e.id),
  );
}

const maskOf = (
  keys: readonly string[],
  table: readonly { key: string; bit: number }[],
) =>
  table
    .filter((t) => keys.includes(t.key))
    .reduce((mask, t) => mask | t.bit, 0);

export function toQuery(
  inputs: Inputs,
  eaten: readonly Eaten[],
  now: number,
): Query {
  const mood = MOOD_QUERY[inputs.mood];
  return {
    ...DEFAULT_QUERY,
    ...mood,
    ...(inputs.hunger !== null && { want_heavy: inputs.hunger }),
    max_price: inputs.budget,
    ban_allergen: maskOf(inputs.banAllergens, ALLERGENS),
    ban_category: maskOf(inputs.banCategories, CATEGORIES),
    recent: recentIds(eaten, now),
  };
}
