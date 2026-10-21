"use client";

import Link from "next/link";
import { AnimatePresence, MotionConfig } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ConfirmSheet from "@/components/ConfirmSheet";
import Fmt from "@/components/Fmt";
import { useI18n } from "@/components/I18nProvider";
import PickCard, { CARD_HEIGHT } from "@/components/PickCard";
import RejectSheet from "@/components/RejectSheet";
import { recentIds } from "@/config/mood";
import { INTL_LOCALE, fmt, href } from "@/i18n/config";
import { passes } from "@/lib/engine/engine";
import { whyLines } from "@/lib/labels";
import {
  ALLERGENS,
  CATEGORIES,
  MENU_BY_ID,
  MENUS,
  type MenuItem,
} from "@/lib/menus";
import { currentQuery, useMenuStore } from "@/lib/store";

export default function PicksView() {
  const { lang, t } = useI18n();
  const { hydrated, picks, inputs, eaten, query, skipped, start, reject } =
    useMenuStore(
      useShallow((s) => ({
        hydrated: s.hydrated,
        picks: s.picks,
        inputs: s.inputs,
        eaten: s.eaten,
        query: s.query,
        skipped: s.skipped,
        start: s.start,
        reject: s.reject,
      })),
    );
  const [rejecting, setRejecting] = useState<MenuItem | null>(null);
  const [chosen, setChosen] = useState<MenuItem | null>(null);
  const [announce, setAnnounce] = useState("");

  // 주소로 바로 들어왔거나 새로고침한 경우: 저장된 입력으로 한 번 고른다.
  useEffect(() => {
    if (hydrated && picks === null) start();
  }, [hydrated, picks, start]);

  const [now] = useState(() => Date.now());
  const { q, count, recent } = useMemo(() => {
    const q = currentQuery({ inputs, eaten, query, skipped }, now);
    return {
      q,
      count: MENUS.filter((m) => passes(m, q)).length,
      recent: recentIds(eaten, now).size,
    };
  }, [inputs, eaten, query, skipped, now]);

  // 걸러 낸 과정을 보여 주면 "대충 뽑은 게 아니구나" 싶어 결과를 더 믿게 된다.
  const excluded = [
    ...ALLERGENS.filter((a) => inputs.banAllergens.includes(a.key)).map(
      (a) => a.label[lang],
    ),
    ...CATEGORIES.filter((c) => inputs.banCategories.includes(c.key)).map(
      (c) => c.label[lang],
    ),
    ...(recent ? [fmt(t.picks.recent, { count: recent })] : []),
  ];

  const ready = hydrated && picks !== null;
  const said = new Set<string>();
  return (
    <MotionConfig reducedMotion="user">
      <h1 className="mt-2 text-2xl font-extrabold">{t.picks.title}</h1>
      <p className="mt-1 mb-5 min-h-6 text-muted" aria-live="polite">
        {ready && (
          <>
            <Fmt
              template={t.picks.count}
              values={{
                total: MENUS.length,
                count: <strong data-testid="candidate-count">{count}</strong>,
              }}
            />
            {picks.length > 0 &&
              picks.length < 3 &&
              fmt(t.picks.fewer, { n: picks.length })}
            {excluded.length > 0 && (
              <span className="mt-1 block text-sm">
                {fmt(t.picks.excluded, {
                  items: new Intl.ListFormat(INTL_LOCALE[lang], {
                    type: "unit",
                  }).format(excluded),
                })}
              </span>
            )}
          </>
        )}
        <span className="sr-only">{announce}</span>
      </p>

      {!ready ? (
        <ul className="space-y-3" aria-hidden>
          {[0, 1, 2].map((i) => (
            <li key={i} className={`card ${CARD_HEIGHT} animate-pulse`} />
          ))}
        </ul>
      ) : picks.length === 0 ? (
        <div className="card text-center">
          <p className="font-bold">{t.picks.empty}</p>
          <p className="mt-1 text-sm text-muted">{t.picks.emptyHint}</p>
          <div className="mt-4 grid gap-2">
            <Link href={href(lang, "/")} className="btn btn-primary">
              {t.picks.change}
            </Link>
            <button type="button" className="btn btn-ghost" onClick={start}>
              {t.picks.revive}
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {picks.map((p, i) => {
              const menu = MENU_BY_ID.get(p.id)!;
              return (
                <PickCard
                  key={p.id}
                  menu={menu}
                  slot={p.slot}
                  reasons={whyLines(
                    p.reasons,
                    menu,
                    p.slot,
                    inputs,
                    q,
                    lang,
                    t,
                    said,
                  )}
                  top={i === 0 && picks.length > 1}
                  priority={i === 0}
                  onChoose={() => setChosen(menu)}
                  onReject={() => setRejecting(menu)}
                />
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-6 grid gap-2">
        <Link href={href(lang, "/browse/")} className="btn btn-ghost">
          {t.picks.browse}
        </Link>
        <Link href={href(lang, "/")} className="text-link text-center text-sm">
          {t.picks.change}
        </Link>
      </div>

      <RejectSheet
        menu={rejecting}
        onClose={() => setRejecting(null)}
        onReject={(reason) => {
          if (rejecting) reject(rejecting.id, reason);
          setRejecting(null);
          setAnnounce(t.picks.reselected);
        }}
      />
      <ConfirmSheet menu={chosen} onClose={() => setChosen(null)} />
    </MotionConfig>
  );
}
