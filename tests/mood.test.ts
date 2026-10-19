import { expect, it } from "vitest";
import { DEFAULT_INPUTS, RECENT_WINDOW_MS, toQuery } from "../config/mood";

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
