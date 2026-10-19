import type { Metadata } from "next";

// 서비스명·주소는 여기서만 바꾸면 사이트 전체에 반영된다.
export const site = {
  name: "오늘 뭐 먹지",
  description:
    "오늘 배고픈 정도, 기분, 예산만 고르면 메뉴 후보 3개를 골라 드려요. 마음에 안 들면 이유를 탭하면 바로 다시 골라 드립니다.",
  // 실제 서비스 주소. Cloudflare Pages 주소가 정해지면 여기를 고치거나
  // 빌드 환경 변수 NEXT_PUBLIC_SITE_URL로 덮어쓴다.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://menu-recommand.pages.dev"
  ).replace(/\/$/, ""),
};

export function pageMeta(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: "ko_KR",
      type: "website",
    },
  };
}
