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
import { fmt, href } from "@/i18n/config";
import { passes } from "@/lib/engine/engine";
import { MENU_BY_ID, MENUS, type MenuItem } from "@/lib/menus";
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

  const count = useMemo(() => {
    const q = currentQuery({ inputs, eaten, query, skipped });
    return MENUS.filter((m) => passes(m, q)).length;
  }, [inputs, eaten, query, skipped]);

  const ready = hydrated && picks !== null;
  return (
    <MotionConfig reducedMotion="user">
      <h1 className="mt-2 text-2xl font-extrabold">{t.picks.title}</h1>
      <p className="mt-1 mb-5 min-h-6 text-muted" aria-live="polite">
        {ready && (
          <>
            <Fmt
              template={t.picks.count}
              values={{
                count: <strong data-testid="candidate-count">{count}</strong>,
              }}
            />
            {picks.length > 0 &&
              picks.length < 3 &&
              fmt(t.picks.fewer, { n: picks.length })}
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
                  reasons={p.reasons}
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
