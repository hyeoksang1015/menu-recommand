import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  applyRejection,
  explain,
  passes,
  pickThree,
  shortlist,
} from "../lib/engine/engine";
import type { Menu, Query, Slot } from "../lib/engine/types";

// 골든 벡터는 `npm run golden`(reference/make_golden.py)이 만든다.
interface RawQuery extends Omit<Query, "recent"> {
  recent: string[];
}
interface Case {
  dataset: string;
  query: RawQuery;
  pref: Record<string, number>;
  seen: Record<string, number>;
  [key: string]: unknown;
}
interface Golden {
  datasets: Record<string, Menu[]>;
  cases: Case[];
}

const load = (name: string): Golden =>
  JSON.parse(
    readFileSync(new URL(`./golden/${name}.json`, import.meta.url), "utf8"),
  );
const toQuery = (raw: RawQuery): Query => ({
  ...raw,
  recent: new Set(raw.recent),
});
const fromQuery = (q: Query): RawQuery => ({
  ...q,
  recent: [...q.recent].sort(),
});

describe("golden vectors", () => {
  it("passes", () => {
    const g = load("passes");
    for (const c of g.cases) {
      const q = toQuery(c.query);
      expect(
        g.datasets[c.dataset].filter((m) => passes(m, q)).map((m) => m.id),
      ).toEqual(c.ids);
    }
  });

  it("pick_three", () => {
    const g = load("pick_three");
    for (const c of g.cases) {
      const got = pickThree(
        g.datasets[c.dataset],
        toQuery(c.query),
        c.pref,
        c.seen,
      );
      const want = c.picks as { slot: Slot; id: string; score: number }[];
      expect(got.map((p) => [p.slot, p.menu.id])).toEqual(
        want.map((p) => [p.slot, p.id]),
      );
      got.forEach((p, i) => expect(p.score).toBeCloseTo(want[i].score, 12));
    }
  });

  it("shortlist", () => {
    const g = load("shortlist");
    for (const c of g.cases) {
      const got = shortlist(
        g.datasets[c.dataset],
        toQuery(c.query),
        c.pref,
        c.k as number,
      );
      const want = c.items as { id: string; score: number }[];
      expect(got.map((x) => x.menu.id)).toEqual(want.map((x) => x.id));
      got.forEach((x, i) => expect(x.score).toBeCloseTo(want[i].score, 12));
    }
  });

  it("explain", () => {
    const g = load("explain");
    for (const c of g.cases) {
      const m = g.datasets[c.dataset].find((x) => x.id === c.id)!;
      expect(
        explain(m, toQuery(c.query), c.slot as Slot, c.pref, c.seen),
      ).toEqual(c.reasons);
    }
  });

  it("rejection", () => {
    const g = load("rejection");
    for (const c of g.cases) {
      const m = g.datasets[c.dataset].find((x) => x.id === c.id)!;
      const q = toQuery(c.query);
      const pref = { ...c.pref };
      const got = applyRejection(q, pref, m, c.reason as string);
      expect(fromQuery(got.query)).toEqual(c.new_query);
      expect(got.pref).toEqual(c.new_pref);
      // 입력 불변
      expect(fromQuery(q)).toEqual(c.query);
      expect(pref).toEqual(c.pref);
    }
  });
});

it("rejects unknown reasons", () => {
  const m = load("passes").datasets.tiny[0];
  expect(() =>
    applyRejection(toQuery(load("passes").cases[0].query), {}, m, "boring"),
  ).toThrow(/unknown/);
});

it("measures one recommendation at N=250", () => {
  const base = load("pick_three").datasets.synthetic;
  const menus = Array.from({ length: 250 }, (_, i) => ({
    ...base[i % base.length],
    id: `p${i}`,
  }));
  const q = toQuery(load("pick_three").cases[20].query);
  const runs = 2000;
  const start = performance.now();
  for (let i = 0; i < runs; i++) pickThree(menus, q, {}, {});
  const ms = (performance.now() - start) / runs;
  console.log(`pickThree N=250: ${(ms * 1000).toFixed(1)}µs per call`);
  expect(ms).toBeLessThan(5);
});
