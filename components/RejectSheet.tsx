"use client";

import { useI18n } from "@/components/I18nProvider";
import Sheet from "@/components/Sheet";
import { fmt } from "@/i18n/config";
import { REASONS } from "@/lib/engine/engine";
import type { Reason } from "@/lib/engine/types";
import { menuName, type MenuItem } from "@/lib/menus";

// 거절 사유 1탭 → 부모가 바로 다시 고른다.
export default function RejectSheet({
  menu,
  onClose,
  onReject,
}: {
  menu: MenuItem | null;
  onClose: () => void;
  onReject: (reason: Reason) => void;
}) {
  const { lang, t } = useI18n();
  return (
    <Sheet
      open={menu !== null}
      onClose={onClose}
      title={menu ? fmt(t.reject.title, { name: menuName(menu, lang) }) : ""}
    >
      <p className="mb-4 text-sm text-muted">{t.reject.lead}</p>
      <div className="grid grid-cols-2 gap-2">
        {REASONS.map((r) => (
          <button
            key={r}
            type="button"
            className="btn btn-ghost"
            onClick={() => onReject(r)}
          >
            {t.reject.reasons[r]}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
