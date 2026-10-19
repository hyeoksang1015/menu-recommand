"use client";

import { useEffect, useRef, type ReactNode } from "react";

// 화면 아래에서 올라오는 시트. 네이티브 <dialog>라 포커스 가두기와 Esc 닫기를 브라우저가 해 준다.
export default function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d?.open) d?.showModal();
    if (!open && d?.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
      className="mx-auto mt-auto mb-0 w-full max-w-xl rounded-t-3xl bg-card p-6 pb-8 text-ink backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost min-h-10 px-4 text-sm"
        >
          닫기
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </dialog>
  );
}
