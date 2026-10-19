import PicksView from "@/components/PicksView";
import { pageMeta } from "@/config/site";

export const metadata = pageMeta(
  "오늘의 3픽",
  "오늘 상태에 맞춰 고른 메뉴 후보 3개",
  "/picks/",
);

export default function PicksPage() {
  return <PicksView />;
}
