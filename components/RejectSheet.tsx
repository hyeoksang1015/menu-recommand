"use client";

import Sheet from "@/components/Sheet";
import { REASONS } from "@/lib/engine/engine";
import type { Menu, Reason } from "@/lib/engine/types";
import { REJECT_LABEL } from "@/lib/labels";

// 거절 사유 1탭 → 부모가 바로 다시 고른다.
export default function RejectSheet({
  menu,
  onClose,
  onReject,
}: {
  menu: Menu | null;
  onClose: () => void;
  onReject: (reason: Reason) => void;
}) {
  return (
    <Sheet
      open={menu !== null}
      onClose={onClose}
      title={menu ? `${menu.name}, 왜 별로예요?` : ""}
    >
      <p className="mb-4 text-sm text-muted">
        이유를 누르면 바로 다시 골라 드려요.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {REASONS.map((r) => (
          <button
            key={r}
            type="button"
            className="btn btn-ghost"
            onClick={() => onReject(r)}
          >
            {REJECT_LABEL[r]}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
