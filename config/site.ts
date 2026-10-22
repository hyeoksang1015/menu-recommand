import type { Metadata } from "next";
import { HTML_LANG, LOCALES, href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/ui";

// 사이트 전체에 한 번만 정의하는 값.
export const site = {
  // 실제 서비스 주소(Cloudflare Pages 프로젝트 menu-recommand). 도메인을 바꾸면 여기를 고치거나
  // 빌드 환경 변수 NEXT_PUBLIC_SITE_URL로 덮어쓴다.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://menu-recommand-b9q.pages.dev"
  ).replace(/\/$/, ""),
  // Google AdSense 게시자 ID(공개 값). public/ads.txt 에도 같은 번호가 들어 있다.
  adsenseClient: "ca-pub-4035979084834637",
  // Google 애널리틱스(GA4) 측정 ID(공개 값). components/GoogleTag.tsx 가 모든 페이지 <head>에 넣는다.
  gaId: "G-5MZDBV6NJ1",
  // 문의 페이지·개인정보처리방침에 공개하는 연락처(운영자가 공개에 동의함).
  contactEmail: "01059182043k@gmail.com",
};

const OG_LOCALE: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

// 같은 페이지의 언어별 주소(hreflang). 기본(x-default)은 한국어.
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], href(l, path)])),
    "x-default": path,
  };
}

export function pageMeta(
  lang: Locale,
  title: string,
  description: string,
  path: string,
  options: { noindex?: boolean; absoluteTitle?: boolean } = {},
): Metadata {
  const { name, tagline } = getDict(lang).site;
  const url = href(lang, path);
  // 링크 공유 썸네일. scripts/make_og.mjs 로 만든 언어별 1200×630 이미지.
  const image = {
    url: `/og/${lang}.png`,
    width: 1200,
    height: 630,
    alt: `${name} - ${tagline}`,
  };
  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    ...(options.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: options.absoluteTitle ? title : `${title} | ${name}`,
      description,
      url,
      siteName: name,
      locale: OG_LOCALE[lang],
      type: "website",
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

// 애드센스 사이트 확인 태그 <meta name="google-adsense-account">. 모든 페이지 <head>에 들어간다.
export const adsenseVerification = {
  "google-adsense-account": site.adsenseClient,
};

// 루트 레이아웃 공통 메타데이터(제목 틀, 기본 설명).
export function rootMeta(lang: Locale): Metadata {
  const t = getDict(lang).site;
  return {
    metadataBase: new URL(site.url),
    title: { default: t.name, template: `%s | ${t.name}` },
    description: t.description,
    other: adsenseVerification,
  };
}

export const viewport = { themeColor: "#ffefc4" };
