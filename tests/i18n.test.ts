import { describe, expect, it } from "vitest";
import { CATEGORY_TEXT } from "../content/categories";
import { GUIDES } from "../content/guides";
import { PAGE_TEXT } from "../content/pages";
import { LOCALES, fmt, href, splitPath } from "../i18n/config";
import { DICTS } from "../i18n/ui";
import { DEFAULT_INPUTS, toQuery } from "../config/mood";
import { budgetLabel, whyLines, won } from "../lib/labels";
import { CATEGORIES, MENU_BY_ID, menuName } from "../lib/menus";

// 객체의 모양(키 경로와 배열 길이)을 문자열 목록으로 펼친다.
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) return [`${path}[${value.length}]`];
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => shape(v, `${path}.${k}`));
  return [path];
}

describe("translations", () => {
  it("every UI dictionary has the same keys and list lengths as Korean", () => {
    for (const lang of LOCALES)
      expect(shape(DICTS[lang]), lang).toEqual(shape(DICTS.ko));
  });

  it("page, category and guide texts exist for every language", () => {
    for (const lang of LOCALES) {
      expect(shape(PAGE_TEXT[lang]).length, lang).toBeGreaterThan(30);
      for (const c of CATEGORIES)
        expect(CATEGORY_TEXT[c.key]?.[lang]?.intro.length).toBeGreaterThan(0);
      for (const g of GUIDES)
        expect(g.text[lang].sections.length).toBe(g.text.ko.sections.length);
    }
  });
});

describe("helpers", () => {
  it("builds and splits localized paths", () => {
    expect(href("ko", "/menus/")).toBe("/menus/");
    expect(href("ja", "/menus/")).toBe("/ja/menus/");
    expect(splitPath("/zh/guides/allergies/")).toEqual({
      lang: "zh",
      path: "/guides/allergies/",
    });
    expect(splitPath("/about/")).toEqual({ lang: "ko", path: "/about/" });
  });

  it("formats prices and templates", () => {
    expect(won(9000, "ko")).toBe("9,000원");
    expect(won(9000, "en")).toBe("₩9,000");
    expect(budgetLabel(15000, "ko")).toBe("1만 5천 원");
    expect(fmt("{name}, {n}", { name: "a", n: 2 })).toBe("a, 2");
  });

  it("names menus per language", () => {
    const m = MENU_BY_ID.get("kimchi-jjigae")!;
    expect([
      menuName(m, "ko"),
      menuName(m, "en"),
      menuName(m, "ja"),
      menuName(m, "zh"),
    ]).toEqual(["김치찌개", "Kimchi Jjigae", "キムチチゲ", "泡菜汤"]);
  });

  it("explains picks by echoing the user's own choices once", () => {
    const m = MENU_BY_ID.get("kimchi-jjigae")!; // 9,000원, 따뜻함, heavy 0.6
    const inputs = { ...DEFAULT_INPUTS, mood: "tired" as const, budget: 15000 };
    const q = toQuery(inputs, [], 0);
    const t = DICTS.ko;
    const said = new Set<string>();
    const codes = ["hot_match", "heavy_match", "in_budget"] as const;
    expect(whyLines(codes, m, "safe", inputs, q, "ko", t, said)).toEqual([
      "피곤하다고 하셔서 따뜻한 걸로 골랐어요.",
      "지친 날이라 든든한 쪽으로 맞췄어요.",
      "1인 예산 1만 5천 원 안이에요. 약 6,000원 남아요.",
    ]);
    // 두 번째 카드부터는 같은 말을 되풀이하지 않고 메뉴 자체의 사실을 쓴다.
    expect(whyLines(codes, m, "mood", inputs, q, "ko", t, said)).toEqual([
      t.reasons.hot,
      t.reasons.medium,
      "1인 예산 1만 5천 원 안이에요. 약 6,000원 남아요.",
    ]);
    // 겨울·조리방식을 고르면 그 선택을 먼저 되짚는다.
    const winter = {
      ...DEFAULT_INPUTS,
      season: "winter" as const,
      cookings: ["stew"],
    };
    expect(
      whyLines(
        ["hot_match"],
        m,
        "safe",
        winter,
        toQuery(winter, [], 0),
        "ko",
        t,
        new Set(),
      ),
    ).toEqual([
      "고르신 찌개·전골 요리 중에서 골랐어요.",
      "겨울이라 따뜻한 걸로 골랐어요.",
    ]);
    // 거절("비쌈")로 예산이 내려갔으면 그 이유를 말한다.
    const cheaper = { ...q, max_price: 8999 };
    expect(
      whyLines(["in_budget"], m, "safe", inputs, cheaper, "ko", t, new Set()),
    ).toEqual([t.reasons.cheaper]);
  });
});
