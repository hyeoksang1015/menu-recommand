import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_INPUTS,
  toQuery,
  type Eaten,
  type Inputs,
} from "@/config/mood";
import { applyRejection, explain, pickThree } from "@/lib/engine/engine";
import type {
  Pref,
  Query,
  Reason,
  ReasonCode,
  Seen,
  Slot,
} from "@/lib/engine/types";
import { MENU_BY_ID, MENUS } from "@/lib/menus";

export interface ShownPick {
  slot: Slot;
  id: string;
  reasons: ReasonCode[];
}

interface State {
  hydrated: boolean;
  // localStorage에 저장
  inputs: Inputs;
  pref: Pref;
  seen: Seen;
  eaten: Eaten[];
  coachDone: boolean;
  // 이번 방문에만 쓰는 값(저장 안 함): 거절로 바뀐 쿼리, 거절한 메뉴, 지금 보이는 3픽
  query: Query | null;
  skipped: string[];
  picks: ShownPick[] | null;

  setInputs: (patch: Partial<Inputs>) => void;
  start: () => void;
  reject: (id: string, reason: Reason) => void;
  recordEaten: (id: string, at?: number) => void;
  removeEaten: (id: string) => void;
  finishCoach: () => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// 화면들이 후보 수를 셀 때도 이 쿼리를 쓴다(화면마다 숫자가 달라지지 않게).
// "그냥 싫음"은 엔진에서 pref만 바꿔 mood 슬롯에 같은 메뉴가 다시 나오므로, 거절한 메뉴는 이번 방문 동안 뺀다.
export function currentQuery(
  s: Pick<State, "query" | "skipped" | "inputs" | "eaten">,
  now = Date.now(),
): Query {
  const q = s.query ?? toQuery(s.inputs, s.eaten, now);
  return s.skipped.length
    ? { ...q, recent: new Set([...q.recent, ...s.skipped]) }
    : q;
}

// 새 3픽을 계산하고, 새로 보여 주는 메뉴만 seen을 올린다.
function round(
  s: State,
  query: Query,
  skipped: string[],
  pref: Pref,
): Partial<State> {
  const q = currentQuery({ ...s, query, skipped });
  const picks = pickThree(MENUS, q, pref, s.seen);
  const before = new Set(s.picks?.map((p) => p.id));
  const seen = { ...s.seen };
  for (const p of picks)
    if (!before.has(p.menu.id)) seen[p.menu.id] = (seen[p.menu.id] ?? 0) + 1;
  return {
    query,
    skipped,
    pref,
    seen,
    picks: picks.map((p) => ({
      slot: p.slot,
      id: p.menu.id,
      reasons: explain(p.menu, q, p.slot, pref, s.seen),
    })),
  };
}

export const useMenuStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      inputs: DEFAULT_INPUTS,
      pref: {},
      seen: {},
      eaten: [],
      coachDone: false,
      query: null,
      skipped: [],
      picks: null,

      setInputs: (patch) =>
        set((s) => ({
          inputs: { ...s.inputs, ...patch },
          query: null,
          skipped: [],
          picks: null,
        })),
      start: () => {
        const s = get();
        set(
          round(
            { ...s, picks: null },
            toQuery(s.inputs, s.eaten, Date.now()),
            [],
            s.pref,
          ),
        );
      },
      reject: (id, reason) => {
        const s = get();
        const menu = MENU_BY_ID.get(id);
        if (!menu) return;
        const next = applyRejection(currentQuery(s), s.pref, menu, reason);
        // 거절은 이번 방문의 쿼리만 바꾼다. 다만 취향(pref)과 "어제 먹음" 기록은 다음 방문에도 남긴다.
        if (reason === "ate_recently")
          get().recordEaten(id, Date.now() - DAY_MS);
        set(round(get(), next.query, [...s.skipped, id], next.pref));
      },
      recordEaten: (id, at = Date.now()) =>
        set((s) => ({
          eaten: [...s.eaten.filter((e) => e.id !== id), { id, at }].slice(-50),
        })),
      removeEaten: (id) =>
        set((s) => ({
          eaten: s.eaten.filter((e) => e.id !== id),
          query: null,
          picks: null,
        })),
      finishCoach: () => set({ coachDone: true }),
    }),
    {
      name: "menu-recommand",
      version: 1,
      // 정적 HTML과 첫 렌더가 같도록 저장값은 마운트 후 StoreHydrator에서 불러온다.
      skipHydration: true,
      // 예전에 저장한 입력에는 나중에 생긴 항목(계절·조리방식)이 없으므로 기본값 위에 덮어쓴다.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        return { ...current, ...p, inputs: { ...current.inputs, ...p.inputs } };
      },
      partialize: (s) => ({
        inputs: s.inputs,
        pref: s.pref,
        seen: s.seen,
        eaten: s.eaten,
        coachDone: s.coachDone,
      }),
    },
  ),
);
