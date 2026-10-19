import { expect, it } from "vitest";
import { MENUS } from "../lib/menus";

it("loads validated menus", () => {
  expect(MENUS.length).toBeGreaterThan(0);
});
