import { expect, it } from "vitest";
import { DEFAULT_INPUTS, RECENT_WINDOW_MS, toQuery } from "../config/mood";
import { passes } from "../lib/engine/engine";
import { MENU_BY_ID } from "../lib/menus";

const NOW = 1_000_000_000_000;

it("uses mood defaults unless hunger was set", () => {
  expect(toQuery({ ...DEFAULT_INPUTS, mood: "tired" }, [], NOW)).toMatchObject({
    want_heavy: 0.8,
    want_hot: true,
  });
  expect(
    toQuery({ ...DEFAULT_INPUTS, mood: "tired", hunger: 0.25 }, [], NOW)
      .want_heavy,
  ).toBe(0.25);
  expect(
    toQuery({ ...DEFAULT_INPUTS, mood: "celebrate", budget: 15000 }, [], NOW),
  ).toMatchObject({
    novel_weight: 1.5,
    max_price: 15000,
  });
});

it("builds ban masks and keeps only recent meals", () => {
  const q = toQuery(
    {
      ...DEFAULT_INPUTS,
      banAllergens: ["milk", "egg"],
      banCategories: ["chinese"],
    },
    [
      { id: "old", at: NOW - RECENT_WINDOW_MS },
      { id: "new", at: NOW - 1 },
    ],
    NOW,
  );
  expect(q.ban_allergen).toBe(0b11);
  expect(q.ban_category).toBe(0b10);
  expect([...q.recent]).toEqual(["new"]);
});

it("leans warm in winter and cold in summer, over the mood", () => {
  expect(
    toQuery({ ...DEFAULT_INPUTS, season: "winter" }, [], NOW).want_hot,
  ).toBe(true);
  expect(
    toQuery({ ...DEFAULT_INPUTS, season: "summer", mood: "tired" }, [], NOW)
      .want_hot,
  ).toBe(false);
  expect(
    toQuery({ ...DEFAULT_INPUTS, season: "spring" }, [], NOW).want_hot,
  ).toBeNull();
});

it("keeps only the chosen cooking styles", () => {
  const q = toQuery({ ...DEFAULT_INPUTS, cookings: ["stew", "soup"] }, [], NOW);
  expect(q.want_cook).toBe(0b11);
  const stew = MENU_BY_ID.get("kimchi-jjigae")!;
  const pizza = MENU_BY_ID.get("margherita-pizza")!;
  expect(passes(stew, q)).toBe(true);
  expect(passes(pizza, q)).toBe(false);
  expect(passes(pizza, toQuery(DEFAULT_INPUTS, [], NOW))).toBe(true);
});
