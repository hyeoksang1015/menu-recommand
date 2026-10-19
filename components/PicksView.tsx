"use client";

import Link from "next/link";
import { AnimatePresence, MotionConfig } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ConfirmSheet from "@/components/ConfirmSheet";
import PickCard, { CARD_HEIGHT } from "@/components/PickCard";
import RejectSheet from "@/components/RejectSheet";
import { passes } from "@/lib/engine/engine";
import type { Menu } from "@/lib/engine/types";
import { MENU_BY_ID, MENUS } from "@/lib/menus";
import { currentQuery, useMenuStore } from "@/lib/store";

export default function PicksView() {
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
  const [rejecting, setRejecting] = useState<Menu | null>(null);
  const [chosen, setChosen] = useState<Menu | null>(null);
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
      <h1 className="mt-2 text-2xl font-extrabold">오늘의 3픽</h1>
      <p className="mt-1 mb-5 min-h-6 text-muted" aria-live="polite">
        {ready && (
          <>
            후보 <strong data-testid="candidate-count">{count}</strong>개 중에서
            골랐어요.
            {picks.length > 0 &&
              picks.length < 3 &&
              ` 맞는 종류가 적어 ${picks.length}개만 나왔어요.`}
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
          <p className="font-bold">조건에 맞는 메뉴가 없어요.</p>
          <p className="mt-1 text-sm text-muted">
            빼는 조건이나 예산을 풀면 다시 골라 드릴게요.
          </p>
          <div className="mt-4 grid gap-2">
            <Link href="/" className="btn btn-primary">
              조건 바꾸기
            </Link>
            <button type="button" className="btn btn-ghost" onClick={start}>
              거절한 메뉴 되살리기
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {picks.map((p) => {
              const menu = MENU_BY_ID.get(p.id)!;
              return (
                <PickCard
                  key={p.id}
                  menu={menu}
                  slot={p.slot}
                  reasons={p.reasons}
                  onChoose={() => setChosen(menu)}
                  onReject={() => setRejecting(menu)}
                />
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-6 grid gap-2">
        <Link href="/browse/" className="btn btn-ghost">
          직접 고를래요
        </Link>
        <Link href="/" className="text-link text-center text-sm">
          조건 바꾸기
        </Link>
      </div>

      <RejectSheet
        menu={rejecting}
        onClose={() => setRejecting(null)}
        onReject={(reason) => {
          if (rejecting) reject(rejecting.id, reason);
          setRejecting(null);
          setAnnounce("새로 골랐어요.");
        }}
      />
      <ConfirmSheet menu={chosen} onClose={() => setChosen(null)} />
    </MotionConfig>
  );
}
