"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Chips from "@/components/Chips";
import { COMPANIES, MOODS, recentIds, type Inputs } from "@/config/mood";
import { passes } from "@/lib/engine/engine";
import { budgetLabel } from "@/lib/labels";
import { ALLERGENS, CATEGORIES, MENU_BY_ID, MENUS } from "@/lib/menus";
import { currentQuery, useMenuStore } from "@/lib/store";

const HUNGER_STEPS = 4;
const HUNGER_TEXT = [
  "아주 가볍게",
  "가볍게",
  "적당히",
  "든든하게",
  "아주 든든하게",
];
const BUDGET = { min: 5000, max: 45000, step: 5000 };
const ANY = "any";

function toggle(list: string[], key: string) {
  if (key === ANY) return [];
  return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
}

export default function InputPanel() {
  const router = useRouter();
  const {
    inputs,
    eaten,
    query,
    skipped,
    setInputs,
    start,
    recordEaten,
    removeEaten,
  } = useMenuStore(
    useShallow((s) => ({
      inputs: s.inputs,
      eaten: s.eaten,
      query: s.query,
      skipped: s.skipped,
      setInputs: s.setInputs,
      start: s.start,
      recordEaten: s.recordEaten,
      removeEaten: s.removeEaten,
    })),
  );
  const set = (patch: Partial<Inputs>) => setInputs(patch);
  // 화면을 연 시각 기준으로 최근 먹은 것을 센다(렌더마다 시계를 읽지 않게).
  const [now] = useState(() => Date.now());
  const recent = useMemo(() => [...recentIds(eaten, now)], [eaten, now]);
  const count = useMemo(() => {
    const q = currentQuery({ inputs, eaten, query, skipped }, now);
    return MENUS.filter((m) => passes(m, q)).length;
  }, [inputs, eaten, query, skipped, now]);
  const excludedCount =
    inputs.banAllergens.length + inputs.banCategories.length + recent.length;

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        start();
        router.push("/picks/");
      }}
    >
      <details data-coach="exclude" className="card">
        <summary className="cursor-pointer font-bold">
          먼저, 빼야 할 것
          {excludedCount > 0 ? ` (${excludedCount}개 제외 중)` : ""}
        </summary>
        <div className="mt-4 space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">못 먹는 재료</legend>
            <Chips
              label="못 먹는 재료"
              options={[{ key: ANY, label: "상관없어" }, ...ALLERGENS]}
              value={inputs.banAllergens.length ? inputs.banAllergens : [ANY]}
              onChange={(k) =>
                set({ banAllergens: toggle(inputs.banAllergens, k) })
              }
            />
            <p className="mt-2 text-xs text-muted">
              재료 정보는 일반적인 조리법 기준의 참고용이에요. 알레르기가 있다면
              꼭 식당에 확인하세요.
            </p>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">
              오늘은 빼고 싶은 종류
            </legend>
            <Chips
              label="빼고 싶은 종류"
              options={[{ key: ANY, label: "상관없어" }, ...CATEGORIES]}
              value={inputs.banCategories.length ? inputs.banCategories : [ANY]}
              onChange={(k) =>
                set({ banCategories: toggle(inputs.banCategories, k) })
              }
            />
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">어제 먹은 것</legend>
            {recent.length > 0 && (
              <ul className="mb-2 flex flex-wrap gap-2">
                {recent.map((id) => (
                  <li key={id}>
                    <button
                      type="button"
                      className="chip"
                      aria-pressed
                      aria-label={`${MENU_BY_ID.get(id)?.name} 다시 포함`}
                      onClick={() => removeEaten(id)}
                    >
                      {MENU_BY_ID.get(id)?.name} ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <select
              aria-label="어제 먹은 메뉴 추가"
              className="min-h-10 w-full rounded-xl border border-line bg-card px-3"
              value=""
              onChange={(e) =>
                e.target.value &&
                recordEaten(e.target.value, Date.now() - 24 * 60 * 60 * 1000)
              }
            >
              <option value="">메뉴를 골라 추가 (없으면 상관없어)</option>
              {CATEGORIES.map((c) => (
                <optgroup key={c.key} label={c.label}>
                  {MENUS.filter(
                    (m) => m.category === c.key && !recent.includes(m.id),
                  ).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </fieldset>
        </div>
      </details>

      <div data-coach="state" className="space-y-8">
        <div role="group" aria-labelledby="hunger-label">
          <div className="mb-2 flex items-center justify-between">
            <p id="hunger-label" className="font-bold">
              얼마나 배고파요?
            </p>
            <button
              type="button"
              className="chip min-h-8 px-3 text-xs"
              aria-pressed={inputs.hunger === null}
              onClick={() => set({ hunger: null })}
            >
              상관없어
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={HUNGER_STEPS}
            step={1}
            value={
              inputs.hunger === null
                ? HUNGER_STEPS / 2
                : inputs.hunger * HUNGER_STEPS
            }
            aria-label="배고픈 정도"
            aria-valuetext={
              inputs.hunger === null
                ? "상관없어"
                : HUNGER_TEXT[inputs.hunger * HUNGER_STEPS]
            }
            onChange={(e) =>
              set({ hunger: Number(e.target.value) / HUNGER_STEPS })
            }
            className={`w-full accent-brand ${inputs.hunger === null ? "opacity-40" : ""}`}
          />
          <div className="flex justify-between text-xs text-muted" aria-hidden>
            <span>가볍게</span>
            <span>적당히</span>
            <span>든든하게</span>
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 font-bold">오늘 기분은?</legend>
          <Chips
            label="오늘 기분"
            options={MOODS}
            value={inputs.mood}
            onChange={(mood) => set({ mood })}
          />
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-bold">누구랑 먹어요?</legend>
          <Chips
            label="동행"
            options={COMPANIES}
            value={inputs.company}
            onChange={(company) => set({ company })}
          />
        </fieldset>

        <div role="group" aria-labelledby="budget-label">
          <div className="mb-2 flex items-center justify-between">
            <p id="budget-label" className="font-bold">
              1인 예산{" "}
              <span className="font-normal text-muted">
                {inputs.budget === null
                  ? "상관없어"
                  : `${budgetLabel(inputs.budget)}까지`}
              </span>
            </p>
            <button
              type="button"
              className="chip min-h-8 px-3 text-xs"
              aria-pressed={inputs.budget === null}
              onClick={() => set({ budget: null })}
            >
              상관없어
            </button>
          </div>
          <input
            type="range"
            min={BUDGET.min}
            max={BUDGET.max}
            step={BUDGET.step}
            value={inputs.budget ?? BUDGET.max}
            aria-label="1인 예산"
            aria-valuetext={
              inputs.budget === null
                ? "상관없어"
                : `${budgetLabel(inputs.budget)}까지`
            }
            onChange={(e) => set({ budget: Number(e.target.value) })}
            className={`w-full accent-brand ${inputs.budget === null ? "opacity-40" : ""}`}
          />
          <div className="flex justify-between text-xs text-muted" aria-hidden>
            <span>{budgetLabel(BUDGET.min)}</span>
            <span>{budgetLabel((BUDGET.min + BUDGET.max) / 2)}</span>
            <span>{budgetLabel(BUDGET.max)}</span>
          </div>
        </div>
      </div>

      <div
        data-coach="start"
        className="sticky bottom-0 -mx-gutter border-t border-line bg-paper/95 px-gutter pt-3 pb-4 backdrop-blur"
      >
        <p className="mb-2 text-center text-sm" aria-live="polite">
          지금 후보 <strong data-testid="candidate-count">{count}</strong>개
          {recent.length > 0 && (
            <span className="text-muted">
              {" "}
              · 최근 먹은 {recent.length}개 제외
            </span>
          )}
        </p>
        <button
          type="submit"
          className="btn btn-primary w-full text-lg"
          disabled={count === 0}
        >
          {count === 0 ? "조건에 맞는 메뉴가 없어요" : "3개 골라줘"}
        </button>
        <p className="mt-2 text-center text-xs text-muted">
          {count === 0
            ? "빼는 조건이나 예산을 조금 풀어 보세요."
            : "다 고르면 3개 골라드려요. 안 골라도 괜찮아요."}
        </p>
      </div>
    </form>
  );
}
