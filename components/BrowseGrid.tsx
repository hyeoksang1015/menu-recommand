"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ConfirmSheet from "@/components/ConfirmSheet";
import Fmt from "@/components/Fmt";
import { useI18n } from "@/components/I18nProvider";
import { MenuPhoto } from "@/components/PickCard";
import { href } from "@/i18n/config";
import { passes, shortlist } from "@/lib/engine/engine";
import { priceLabel } from "@/lib/labels";
import { MENUS, menuName, type MenuItem } from "@/lib/menus";
import { currentQuery, useMenuStore } from "@/lib/store";

const K = 12;
// 자리표시와 실제 카드 높이를 맞춘다(모바일에서 잰 값).
const TILE_HEIGHT = "min-h-64";

// 직접 고르기: 3픽과 같은 쿼리로 상위 12개를 보여 준다. 카드 전체가 버튼이다.
export default function BrowseGrid() {
  const { lang, t } = useI18n();
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
  const [chosen, setChosen] = useState<MenuItem | null>(null);
  const { items, count } = useMemo(() => {
    const q = currentQuery({ inputs, eaten, query, skipped });
    return {
      items: shortlist(MENUS, q, pref, K) as {
        menu: MenuItem;
        score: number;
      }[],
      count: MENUS.filter((m) => passes(m, q)).length,
    };
  }, [inputs, eaten, query, skipped, pref]);

  return (
    <>
      <h1 className="mt-2 text-2xl font-extrabold">{t.browse.title}</h1>
      <p className="mt-1 mb-5 min-h-9 text-muted">
        {hydrated && (
          <Fmt
            template={t.browse.count}
            values={{
              count: <strong data-testid="candidate-count">{count}</strong>,
              n: Math.min(K, count),
            }}
          />
        )}
      </p>
      {!hydrated ? (
        <ul className="grid grid-cols-2 gap-3" aria-hidden>
          {Array.from({ length: K }, (_, i) => (
            <li key={i} className={`card ${TILE_HEIGHT} animate-pulse`} />
          ))}
        </ul>
      ) : items.length === 0 ? (
        <div className="card text-center">
          <p className="font-bold">{t.picks.empty}</p>
          <Link href={href(lang, "/")} className="btn btn-primary mt-4">
            {t.picks.change}
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {items.map(({ menu }, i) => (
            <li key={menu.id}>
              <button
                type="button"
                onClick={() => setChosen(menu)}
                className={`card flex h-full ${TILE_HEIGHT} w-full cursor-pointer flex-col gap-2 p-3 text-left hover:bg-soft`}
              >
                <MenuPhoto menu={menu} priority={i < 2} />
                <span className="font-bold">{menuName(menu, lang)}</span>
                <span className="badge self-start">
                  {priceLabel(menu, lang, t)}
                </span>
                <span className="text-xs text-muted">
                  {t.menu.spice[menu.spice]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 grid gap-2">
        <Link href={href(lang, "/picks/")} className="btn btn-ghost">
          {t.browse.back}
        </Link>
      </div>
      <ConfirmSheet menu={chosen} onClose={() => setChosen(null)} />
    </>
  );
}
