import BrowseGrid from "@/components/BrowseGrid";
import { pageMeta } from "@/config/site";

export const metadata = pageMeta(
  "직접 고르기",
  "오늘 조건에 잘 맞는 메뉴 12개를 보고 직접 골라 보세요.",
  "/browse/",
);

export default function BrowsePage() {
  return <BrowseGrid />;
}
