import { describe, expect, it } from "vitest";
import { CATEGORY_TEXT } from "../content/categories";
import { GUIDES } from "../content/guides";
import { PAGE_TEXT } from "../content/pages";
import { LOCALES, fmt, href, splitPath } from "../i18n/config";
import { DICTS } from "../i18n/ui";
import { budgetLabel, won } from "../lib/labels";
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
});
