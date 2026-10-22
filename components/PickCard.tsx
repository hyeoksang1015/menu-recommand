"use client";

import { motion } from "motion/react";
import { useI18n } from "@/components/I18nProvider";
import type { Slot } from "@/lib/engine/types";
import { priceLabel } from "@/lib/labels";
import {
  CATEGORY_BY_KEY,
  menuName,
  photoUrl,
  type MenuItem,
} from "@/lib/menus";

// 저장값을 불러오기 전 자리표시와 실제 카드의 높이를 맞춰 화면 밀림(CLS)을 막는다.
// 모바일(412px)에서 잰 실제 카드 높이(글자 1.5배, 이유 문장 4줄 기준 최대 약 760px).
export const CARD_HEIGHT = "min-h-[48rem]";

// 4:3 음식 사진. 사진이 없는 메뉴(Commons에 맞는 사진이 없던 것)는 카테고리 이모지로 채운다.
// 사진은 빌드 전에 480×360 webp로 줄여 두었으므로 next/image 최적화 없이 <img>로 바로 쓴다.
export function MenuPhoto({
  menu,
  className = "",
  priority = false,
}: {
  menu: MenuItem;
  className?: string;
  priority?: boolean;
}) {
  const { lang } = useI18n();
  const src = photoUrl(menu);
  return (
    <div
      className={`aspect-[4/3] overflow-hidden rounded-2xl bg-soft ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 이미 줄인 webp를 그대로 쓴다
        <img
          src={src}
          alt={menuName(menu, lang)}
          width={480}
          height={360}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden className="grid h-full place-items-center text-6xl">
          {CATEGORY_BY_KEY.get(menu.category)?.emoji}
        </div>
      )}
    </div>
  );
}

export function MenuBadges({ menu }: { menu: MenuItem }) {
  const { lang, t } = useI18n();
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="badge">{priceLabel(menu, lang, t)}</span>
      <span className="badge">{t.menu.spice[menu.spice]}</span>
      <span className="badge">{menu.hot ? t.menu.hot : t.menu.cold}</span>
    </div>
  );
}

export default function PickCard({
  menu,
  slot,
  reasons,
  top,
  priority,
  onChoose,
  onReject,
}: {
  menu: MenuItem;
  slot: Slot;
  reasons: string[];
  // 첫 카드에 "고민되면 이걸로"를 붙여, 셋 중에서 또 고민하지 않게 기본값을 정해 준다.
  top: boolean;
  priority: boolean;
  onChoose: () => void;
  onReject: () => void;
}) {
  const { lang, t } = useI18n();
  const name = menuName(menu, lang);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`card ${CARD_HEIGHT} flex flex-col`}
      aria-label={`${t.slots[slot]}: ${name}`}
    >
      <p className="flex items-center gap-2 text-xs font-bold text-brand">
        {t.slots[slot]}
        {top && (
          <span className="rounded-full bg-sky px-2 py-0.5 text-brand-dark">
            {t.picks.top}
          </span>
        )}
      </p>
      <MenuPhoto menu={menu} priority={priority} className="mt-2" />
      <div className="mt-3 flex-1 space-y-2">
        <h2 className="text-xl font-extrabold">
          {name}
          <span className="ml-2 text-sm font-normal text-muted">
            {CATEGORY_BY_KEY.get(menu.category)?.label[lang]}
          </span>
        </h2>
        <MenuBadges menu={menu} />
        <div className="rounded-2xl bg-paper/70 p-3 text-sm leading-relaxed">
          <p className="text-muted">{t.slotWhy[slot]}</p>
          {reasons.length > 0 && (
            <ul aria-label={t.picks.reasonsAria}>
              {reasons.map((r) => (
                <li key={r} className="flex gap-1.5">
                  <span aria-hidden className="text-accent">
                    ✓
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className="btn btn-ghost" onClick={onReject}>
          {t.picks.reject}
        </button>
        <button type="button" className="btn btn-primary" onClick={onChoose}>
          {t.picks.choose}
        </button>
      </div>
    </motion.li>
  );
}
