"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { useMenuStore } from "@/lib/store";

// 첫 방문 1회, 3단계, 언제나 {t.coach.skip}. 화면 아래에 고정해 레이아웃을 밀지 않는다.
const TARGETS = ["exclude", "state", "start"];

export default function CoachMarks() {
  const { t } = useI18n();
  const hydrated = useMenuStore((s) => s.hydrated);
  const done = useMenuStore((s) => s.coachDone);
  const finish = useMenuStore((s) => s.finishCoach);
  const [step, setStep] = useState(0);
  const active = hydrated && !done;

  useEffect(() => {
    if (!active) return;
    const el = document.querySelector<HTMLElement>(
      `[data-coach="${TARGETS[step]}"]`,
    );
    el?.classList.add("coach-target");
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return () => el?.classList.remove("coach-target");
  }, [active, step]);

  if (!active) return null;
  const last = step === TARGETS.length - 1;
  return (
    <div
      role="dialog"
      aria-label={t.coach.label}
      className="fixed inset-x-0 bottom-44 z-20 mx-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-ink p-4 text-white shadow-lg"
    >
      <p className="text-xs opacity-80">
        {step + 1} / {TARGETS.length}
      </p>
      <p className="mt-1 font-semibold">{t.coach.steps[step]}</p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          className="btn min-h-10 px-4 text-sm text-white underline"
          onClick={finish}
        >
          {t.coach.skip}
        </button>
        <button
          type="button"
          className="btn min-h-10 bg-white px-4 text-sm text-ink"
          onClick={() => (last ? finish() : setStep(step + 1))}
        >
          {last ? t.coach.begin : t.coach.next}
        </button>
      </div>
    </div>
  );
}
