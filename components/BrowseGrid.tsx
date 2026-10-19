"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ConfirmSheet from "@/components/ConfirmSheet";
import { MenuThumb } from "@/components/PickCard";
import { passes, shortlist } from "@/lib/engine/engine";
import type { Menu } from "@/lib/engine/types";
import { SPICE, won } from "@/lib/labels";
import { MENUS } from "@/lib/menus";
import { currentQuery, useMenuStore } from "@/lib/store";

const K = 12;

// 직접 고르기: 3픽과 같은 쿼리로 상위 12개를 보여 준다. 카드 전체가 버튼이다.
export default function BrowseGrid() {
  const { hydrated, inputs, eaten, query, skipped, pref } = useMenuStore(
    useShallow((s) => ({
      hydrated: s.hydrated,
      inputs: s.inputs,
      eaten: s.eaten,
      query: s.query,
      skipped: s.skipped,
      pref: s.pref,
    })),
  );
  const [chosen, setChosen] = useState<Menu | null>(null);
  const { items, count } = useMemo(() => {
    const q = currentQuery({ inputs, eaten, query, skipped });
    return {
      items: shortlist(MENUS, q, pref, K),
      count: MENUS.filter((m) => passes(m, q)).length,
    };
  }, [inputs, eaten, query, skipped, pref]);

  return (
    <>
      <h1 className="mt-2 text-2xl font-extrabold">직접 고르기</h1>
      <p className="mt-1 mb-5 min-h-6 text-muted">
        {hydrated && (
          <>
            후보 <strong data-testid="candidate-count">{count}</strong>개 중
            상위 {Math.min(K, count)}개예요.
          </>
        )}
      </p>
      {!hydrated ? (
        <ul className="grid grid-cols-2 gap-3" aria-hidden>
          {Array.from({ length: K }, (_, i) => (
            <li key={i} className="card min-h-46 animate-pulse" />
          ))}
        </ul>
      ) : items.length === 0 ? (
        <div className="card text-center">
          <p className="font-bold">조건에 맞는 메뉴가 없어요.</p>
          <Link href="/" className="btn btn-primary mt-4">
            조건 바꾸기
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {items.map(({ menu }) => (
            <li key={menu.id}>
              <button
                type="button"
                onClick={() => setChosen(menu)}
                className="card flex h-full min-h-46 w-full cursor-pointer flex-col items-center gap-2 p-4 text-center hover:bg-soft"
              >
                <MenuThumb menu={menu} size="h-16 w-16 text-3xl" />
                <span className="font-bold">{menu.name}</span>
                <span className="badge">약 {won(menu.price)}</span>
                <span className="text-xs text-muted">{SPICE[menu.spice]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 grid gap-2">
        <Link href="/picks/" className="btn btn-ghost">
          3픽으로 돌아가기
        </Link>
      </div>
      <ConfirmSheet menu={chosen} onClose={() => setChosen(null)} />
    </>
  );
}
