import CoachMarks from "@/components/CoachMarks";
import InputPanel from "@/components/InputPanel";

export default function Home() {
  return (
    <>
      <h1 className="mt-2 text-2xl font-extrabold">오늘 뭐 먹지?</h1>
      <p className="mt-1 mb-6 text-muted">
        지금 상태만 알려 주면 메뉴 3개를 골라 드려요.
      </p>
      <InputPanel />
      <CoachMarks />
    </>
  );
}
