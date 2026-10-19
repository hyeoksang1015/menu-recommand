// reference/engine.py 의 데이터 타입을 그대로 옮겼다. 필드 이름도 JSON(골든 벡터, menus.json)과 같다.

export type Slot = "safe" | "mood" | "novel";
export type Reason = "ate_recently" | "too_greasy" | "too_pricey" | "dislike";
export type ReasonCode =
  | "liked_category"
  | "new_for_you"
  | "hot_match"
  | "heavy_match"
  | "in_budget"
  | "not_greasy";

export interface Menu {
  id: string;
  name: string;
  category: string;
  category_bit: number;
  allergen_mask: number;
  price: number;
  spice: number;
  heavy: number;
  oily: number;
  hot: boolean;
}

export interface Query {
  ban_allergen: number;
  ban_category: number;
  max_price: number | null;
  max_spice: number;
  max_oily: number;
  want_heavy: number;
  want_hot: boolean | null;
  recent: ReadonlySet<string>;
  // 기념 기분에서 novel 슬롯을 올리는 가중치(spec 7절). 기본 1.
  novel_weight: number;
}

export type Pref = Readonly<Record<string, number>>;
export type Seen = Readonly<Record<string, number>>;

export interface Pick {
  slot: Slot;
  menu: Menu;
  score: number;
}
