import type { Menu, Reason, ReasonCode, Slot } from "@/lib/engine/types";

// 엔진 코드 → 화면 문구. 문구는 여기서만 고친다.

export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export function budgetLabel(n: number) {
  const man = Math.floor(n / 10000);
  const rest = (n % 10000) / 1000;
  return `${man ? `${man}만` : ""}${rest ? ` ${rest}천` : ""} 원`.trim();
}

export const SPICE = [
  "안 매움",
  "살짝 매움",
  "약간 매움",
  "매콤",
  "매움",
  "아주 매움",
];

export const SLOT_LABEL: Record<Slot, string> = {
  safe: "무난한 선택",
  mood: "오늘 상태에 딱",
  novel: "새로운 도전",
};

export function reasonLabel(code: ReasonCode, m: Menu): string {
  switch (code) {
    case "liked_category":
      return "좋아하는 종류";
    case "new_for_you":
      return "처음 추천";
    case "hot_match":
      return m.hot ? "따뜻한 음식" : "시원한 음식";
    case "heavy_match":
      return m.heavy >= 0.65
        ? "든든해요"
        : m.heavy <= 0.35
          ? "가벼워요"
          : "적당한 양";
    case "in_budget":
      return "예산 안";
    case "not_greasy":
      return "덜 느끼해요";
  }
}

export const REJECT_LABEL: Record<Reason, string> = {
  ate_recently: "어제 먹음",
  too_greasy: "느끼함",
  too_pricey: "비쌈",
  dislike: "그냥 싫음",
};
