"use client";

import { motion } from "motion/react";
import type { Menu, ReasonCode, Slot } from "@/lib/engine/types";
import { reasonLabel, SLOT_LABEL, SPICE, won } from "@/lib/labels";
import { CATEGORY_BY_KEY } from "@/lib/menus";

export const CARD_HEIGHT = "min-h-44";

// 사진 자리는 이미지 방식이 정해질 때까지(spec 12절) 카테고리 이모지로 채운다.
export function MenuThumb({
  menu,
  size = "h-20 w-20 text-4xl",
}: {
  menu: Menu;
  size?: string;
}) {
  return (
    <div
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-2xl bg-soft ${size}`}
    >
      {CATEGORY_BY_KEY.get(menu.category)?.emoji}
    </div>
  );
}

export function MenuBadges({ menu }: { menu: Menu }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="badge">약 {won(menu.price)}</span>
      <span className="badge">{SPICE[menu.spice]}</span>
      <span className="badge">{menu.hot ? "따뜻하게" : "차갑게"}</span>
    </div>
  );
}

export default function PickCard({
  menu,
  slot,
  reasons,
  onChoose,
  onReject,
}: {
  menu: Menu;
  slot: Slot;
  reasons: ReasonCode[];
  onChoose: () => void;
  onReject: () => void;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`card ${CARD_HEIGHT}`}
      aria-label={`${SLOT_LABEL[slot]}: ${menu.name}`}
    >
      <p className="text-xs font-bold text-brand">{SLOT_LABEL[slot]}</p>
      <div className="mt-2 flex gap-4">
        <MenuThumb menu={menu} />
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="text-xl font-extrabold">
            {menu.name}
            <span className="ml-2 text-sm font-normal text-muted">
              {CATEGORY_BY_KEY.get(menu.category)?.label}
            </span>
          </h2>
          <MenuBadges menu={menu} />
          {reasons.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="추천 이유">
              {reasons.map((r) => (
                <li
                  key={r}
                  className="rounded-full border border-line px-2.5 py-0.5 text-xs"
                >
                  {reasonLabel(r, menu)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className="btn btn-ghost" onClick={onReject}>
          다른 거
        </button>
        <button type="button" className="btn btn-primary" onClick={onChoose}>
          이걸로!
        </button>
      </div>
    </motion.li>
  );
}
