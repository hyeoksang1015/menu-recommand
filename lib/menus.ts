import { z } from "zod";
import { LOCALES, type Locale } from "@/i18n/config";
import raw from "@/public/menus.json";

// public/menus.json(scripts/build_menus.py 가 생성)을 Zod로 검증한다.
// 정적 생성 중에 이 모듈이 실행되므로 값이 잘못되면 `next build`가 실패한다.
const unit = z.number().min(0).max(1);
const text = z.string().min(1);
const Labels = z.object({ ko: text, en: text, ja: text, zh: text });
const MenuSchema = z.object({
  id: text,
  name: text,
  name_en: text,
  name_ja: text,
  name_zh: text,
  category: z.string(),
  category_bit: z.number().int().positive(),
  allergen_mask: z.number().int().nonnegative(),
  price: z.number().int().positive(),
  spice: z.number().int().min(0).max(5),
  heavy: unit,
  oily: unit,
  hot: z.boolean(),
  photo: z
    .object({ file: text, author: text, license: text, license_url: text })
    .nullable(),
});
const DataSchema = z
  .object({
    locales: z.array(z.string()),
    categories: z.array(
      z.object({
        key: z.string(),
        emoji: z.string(),
        bit: z.number().int().positive(),
        label: Labels,
      }),
    ),
    allergens: z.array(
      z.object({
        key: z.string(),
        bit: z.number().int().positive(),
        label: Labels,
      }),
    ),
    menus: z.array(MenuSchema).min(1),
  })
  .superRefine((data, ctx) => {
    if (data.locales.join() !== LOCALES.join())
      ctx.addIssue({
        code: "custom",
        message: "locales differ from i18n/config.ts",
      });
    const bits = new Map(data.categories.map((c) => [c.key, c.bit]));
    const ids = new Set<string>();
    for (const m of data.menus) {
      if (bits.get(m.category) !== m.category_bit)
        ctx.addIssue({ code: "custom", message: `bad category: ${m.id}` });
      if (ids.has(m.id))
        ctx.addIssue({ code: "custom", message: `duplicate id: ${m.id}` });
      ids.add(m.id);
    }
  });

export type MenuItem = z.infer<typeof MenuSchema>;
export type Category = z.infer<typeof DataSchema>["categories"][number];

export const {
  categories: CATEGORIES,
  allergens: ALLERGENS,
  menus: MENUS,
} = DataSchema.parse(raw);
export const CATEGORY_BY_KEY = new Map(CATEGORIES.map((c) => [c.key, c]));
export const MENU_BY_ID = new Map(MENUS.map((m) => [m.id, m]));

export const menuName = (m: MenuItem, lang: Locale) =>
  lang === "ko" ? m.name : m[`name_${lang}`];
export const photoUrl = (m: MenuItem) =>
  m.photo ? `/photos/${m.id}.webp` : null;
export const commonsUrl = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`;
