"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import Chips from "@/components/Chips";
import Fmt from "@/components/Fmt";
import { useI18n } from "@/components/I18nProvider";
import {
  COMPANY_KEYS,
  MOOD_KEYS,
  SEASON_KEYS,
  recentIds,
  type Inputs,
} from "@/config/mood";
import { fmt, href } from "@/i18n/config";
import { passes } from "@/lib/engine/engine";
import { budgetLabel } from "@/lib/labels";
import {
  ALLERGENS,
  CATEGORIES,
  COOKINGS,
  MENU_BY_ID,
  MENUS,
  menuName,
} from "@/lib/menus";
import { currentQuery, useMenuStore } from "@/lib/store";

const HUNGER_STEPS = 4;
const BUDGET = { min: 5000, max: 45000, step: 5000 };
const ANY = "any";
const DAY_MS = 24 * 60 * 60 * 1000;

function toggle(list: string[], key: string) {
  if (key === ANY) return [];
  return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
}

// 빼주께·맞춰주께 카드. 제목과 한 줄 설명을 붙여 접지 않고 처음부터 보여 준다.
function Panel({
  id,
  title,
  lead,
  coach,
  children,
}: {
  id: string;
  title: string;
  lead: string;
  coach: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} data-coach={coach} className="card space-y-6">
      <header>
        <h2 id={id} className="text-xl font-extrabold text-brand">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted">{lead}</p>
      </header>
      {children}
    </section>
  );
}

export default function InputPanel() {
  const router = useRouter();
  const { lang, t } = useI18n();
  const h = t.home;
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
  const anyChip = { key: ANY, label: h.any };
  const budgetText =
    inputs.budget === null
      ? h.any
      : fmt(h.budgetUpTo, { amount: budgetLabel(inputs.budget, lang) });

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        start();
        router.push(href(lang, "/picks/"));
      }}
    >
      <Panel
        id="exclude-title"
        title={h.exclude}
        lead={h.excludeLead}
        coach="exclude"
      >
        {/* data-clarity-mask: 못 먹는 재료(알레르기) 선택은 건강 정보라 Clarity 화면 녹화에서 가린다. */}
        <fieldset data-clarity-mask="true">
          <legend className="mb-2 text-sm font-semibold">{h.allergens}</legend>
          <Chips
            label={h.allergens}
            options={[
              anyChip,
              ...ALLERGENS.map((a) => ({ key: a.key, label: a.label[lang] })),
            ]}
            value={inputs.banAllergens.length ? inputs.banAllergens : [ANY]}
            onChange={(k) =>
              set({ banAllergens: toggle(inputs.banAllergens, k) })
            }
          />
          <p className="mt-2 text-xs text-muted">{h.allergenNote}</p>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{h.categories}</legend>
          <Chips
            label={h.categoriesAria}
            options={[
              anyChip,
              ...CATEGORIES.map((c) => ({ key: c.key, label: c.label[lang] })),
            ]}
            value={inputs.banCategories.length ? inputs.banCategories : [ANY]}
            onChange={(k) =>
              set({ banCategories: toggle(inputs.banCategories, k) })
            }
          />
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{h.recent}</legend>
          {recent.length > 0 && (
            <ul className="mb-2 flex flex-wrap gap-2">
              {recent.map((id) => {
                const m = MENU_BY_ID.get(id);
                const name = m ? menuName(m, lang) : id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className="chip"
                      aria-pressed
                      aria-label={fmt(h.recentRemove, { name })}
                      onClick={() => removeEaten(id)}
                    >
                      {name} ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <select
            aria-label={h.recentAdd}
            className="min-h-10 w-full rounded-xl border border-line bg-card px-3"
            value=""
            onChange={(e) =>
              e.target.value && recordEaten(e.target.value, Date.now() - DAY_MS)
            }
          >
            <option value="">{h.recentPlaceholder}</option>
            {CATEGORIES.map((c) => (
              <optgroup key={c.key} label={c.label[lang]}>
                {MENUS.filter(
                  (m) => m.category === c.key && !recent.includes(m.id),
                ).map((m) => (
                  <option key={m.id} value={m.id}>
                    {menuName(m, lang)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </fieldset>
      </Panel>

      <Panel id="match-title" title={h.match} lead={h.matchLead} coach="state">
        <div role="group" aria-labelledby="hunger-label">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p id="hunger-label" className="font-bold">
              {h.hunger}
            </p>
            <button
              type="button"
              className="chip min-h-8 shrink-0 px-3 text-xs"
              aria-pressed={inputs.hunger === null}
              onClick={() => set({ hunger: null })}
            >
              {h.any}
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
            aria-label={h.hungerAria}
            aria-valuetext={
              inputs.hunger === null
                ? h.any
                : h.hungerText[inputs.hunger * HUNGER_STEPS]
            }
            onChange={(e) =>
              set({ hunger: Number(e.target.value) / HUNGER_STEPS })
            }
            className={`w-full accent-brand ${inputs.hunger === null ? "opacity-40" : ""}`}
          />
          <div className="flex justify-between text-xs text-muted" aria-hidden>
            {h.hungerEnds.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 font-bold">{h.mood}</legend>
          <Chips
            label={h.moodAria}
            options={MOOD_KEYS.map((k) => ({ key: k, label: h.moods[k] }))}
            value={inputs.mood}
            onChange={(mood) => set({ mood })}
          />
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-bold">{h.season}</legend>
          <Chips
            label={h.seasonAria}
            options={SEASON_KEYS.map((k) => ({
              key: k,
              label: k === "any" ? h.any : h.seasons[k],
            }))}
            value={inputs.season}
            onChange={(season) => set({ season })}
          />
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-bold">{h.cooking}</legend>
          <Chips
            label={h.cookingAria}
            options={[
              anyChip,
              ...COOKINGS.map((c) => ({ key: c.key, label: c.label[lang] })),
            ]}
            value={inputs.cookings.length ? inputs.cookings : [ANY]}
            onChange={(k) => set({ cookings: toggle(inputs.cookings, k) })}
          />
          <p className="mt-2 text-xs text-muted">{h.cookingNote}</p>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-bold">{h.company}</legend>
          <Chips
            label={h.companyAria}
            options={COMPANY_KEYS.map((k) => ({
              key: k,
              label: h.companies[k],
            }))}
            value={inputs.company}
            onChange={(company) => set({ company })}
          />
        </fieldset>

        <div role="group" aria-labelledby="budget-label">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p id="budget-label" className="font-bold">
              {h.budget}{" "}
              <span className="font-normal text-muted">{budgetText}</span>
            </p>
            <button
              type="button"
              className="chip min-h-8 shrink-0 px-3 text-xs"
              aria-pressed={inputs.budget === null}
              onClick={() => set({ budget: null })}
            >
              {h.any}
            </button>
          </div>
          <input
            type="range"
            min={BUDGET.min}
            max={BUDGET.max}
            step={BUDGET.step}
            value={inputs.budget ?? BUDGET.max}
            aria-label={h.budget}
            aria-valuetext={budgetText}
            onChange={(e) => set({ budget: Number(e.target.value) })}
            className={`w-full accent-brand ${inputs.budget === null ? "opacity-40" : ""}`}
          />
          <div className="flex justify-between text-xs text-muted" aria-hidden>
            <span>{budgetLabel(BUDGET.min, lang)}</span>
            <span>{budgetLabel((BUDGET.min + BUDGET.max) / 2, lang)}</span>
            <span>{budgetLabel(BUDGET.max, lang)}</span>
          </div>
        </div>
      </Panel>

      <div
        data-coach="start"
        className="sticky bottom-0 -mx-gutter border-t border-line bg-paper/95 px-gutter pt-3 pb-4 backdrop-blur"
      >
        <p className="mb-2 text-center text-sm" aria-live="polite">
          <Fmt
            template={h.count}
            values={{
              count: <strong data-testid="candidate-count">{count}</strong>,
            }}
          />
          {recent.length > 0 && (
            <span className="text-muted">
              {" "}
              · {fmt(h.recentExcluded, { count: recent.length })}
            </span>
          )}
        </p>
        <button
          type="submit"
          className="btn btn-primary w-full text-lg"
          disabled={count === 0}
        >
          {count === 0 ? h.none : h.start}
        </button>
        <p className="mt-2 text-center text-xs text-muted">
          {count === 0 ? h.noneHint : h.hint}
        </p>
      </div>
    </form>
  );
}
