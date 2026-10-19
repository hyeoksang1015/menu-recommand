import { z } from "zod";
import raw from "@/public/menus.json";

// public/menus.json(scripts/build_menus.py 가 생성)을 Zod로 검증한다.
// 정적 생성 중에 이 모듈이 실행되므로 값이 잘못되면 `next build`가 실패한다.
const unit = z.number().min(0).max(1);
const MenuSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string(),
  category_bit: z.number().int().positive(),
  allergen_mask: z.number().int().nonnegative(),
  price: z.number().int().positive(),
  spice: z.number().int().min(0).max(5),
  heavy: unit,
  oily: unit,
  hot: z.boolean(),
});
const DataSchema = z
  .object({
    categories: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        emoji: z.string(),
        bit: z.number().int().positive(),
      }),
    ),
    allergens: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        bit: z.number().int().positive(),
      }),
    ),
    menus: z.array(MenuSchema).min(1),
  })
  .superRefine((data, ctx) => {
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

export const {
  categories: CATEGORIES,
  allergens: ALLERGENS,
  menus: MENUS,
} = DataSchema.parse(raw);
export const CATEGORY_BY_KEY = new Map(CATEGORIES.map((c) => [c.key, c]));
