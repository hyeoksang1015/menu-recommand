import type { ReactNode } from "react";
import RootShell from "@/components/RootShell";
import { rootMeta } from "@/config/site";

// 한국어 루트 레이아웃. 주소에 언어 접두어가 없다(/, /picks/ …).
export const metadata = rootMeta("ko");
export { viewport } from "@/config/site";

export default function KoLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="ko">{children}</RootShell>;
}
