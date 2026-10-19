"use client";

import { useEffect, useState } from "react";
import { useMenuStore } from "@/lib/store";

// 첫 방문 1회, 3단계, 언제나 건너뛰기. 화면 아래에 고정해 레이아웃을 밀지 않는다.
const STEPS = [
  { target: "exclude", text: "못 먹는 것이 있으면 여기서 먼저 빼 주세요." },
  {
    target: "state",
    text: "배고픈 정도와 기분을 고르면 후보 수가 바로 줄어요. 모르겠으면 상관없어!",
  },
  { target: "start", text: "버튼 한 번이면 메뉴 3개를 골라 드려요." },
];

export default function CoachMarks() {
  const hydrated = useMenuStore((s) => s.hydrated);
  const done = useMenuStore((s) => s.coachDone);
  const finish = useMenuStore((s) => s.finishCoach);
  const [step, setStep] = useState(0);
  const active = hydrated && !done;

  useEffect(() => {
    if (!active) return;
    const el = document.querySelector<HTMLElement>(
      `[data-coach="${STEPS[step].target}"]`,
    );
    el?.classList.add("coach-target");
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return () => el?.classList.remove("coach-target");
  }, [active, step]);

  if (!active) return null;
  const last = step === STEPS.length - 1;
  return (
    <div
      role="dialog"
      aria-label="사용 방법 안내"
      className="fixed inset-x-0 bottom-44 z-20 mx-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-ink p-4 text-white shadow-lg"
    >
      <p className="text-xs opacity-80">
        {step + 1} / {STEPS.length}
      </p>
      <p className="mt-1 font-semibold">{STEPS[step].text}</p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          className="btn min-h-10 px-4 text-sm text-white underline"
          onClick={finish}
        >
          건너뛰기
        </button>
        <button
          type="button"
          className="btn min-h-10 bg-white px-4 text-sm text-ink"
          onClick={() => (last ? finish() : setStep(step + 1))}
        >
          {last ? "시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}
