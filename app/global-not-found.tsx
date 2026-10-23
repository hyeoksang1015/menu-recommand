import type { Metadata } from "next";
import ClarityTag from "@/components/ClarityTag";
import GoogleTag from "@/components/GoogleTag";
import { adsenseVerification } from "@/config/site";
import { PAGE_TEXT } from "@/content/pages";
import { LOCALES, href } from "@/i18n/config";
import "./globals.css";

// 어느 라우트에도 맞지 않는 주소의 404 화면(루트 레이아웃이 둘이라 전역 404를 따로 둔다).
// 콘텐츠가 없는 페이지이므로 애드센스 스크립트를 넣지 않는다.
export const metadata: Metadata = {
  title: "404 | 골라주께",
  robots: { index: false, follow: true },
  // 광고 스크립트는 넣지 않지만, 사이트 확인 메타 태그는 모든 페이지에 둔다.
  other: adsenseVerification,
};

export default function GlobalNotFound() {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <GoogleTag />
        <ClarityTag />
      </head>
      <body className="flex min-h-full flex-col items-center justify-center px-gutter py-16">
        <main className="w-full max-w-md space-y-8 text-center">
          <p className="text-5xl" aria-hidden>
            🍚
          </p>
          {LOCALES.map((lang) => {
            const t = PAGE_TEXT[lang].notFound;
            return (
              <section key={lang} lang={lang === "zh" ? "zh-Hans" : lang}>
                <h1 className="text-xl font-extrabold">{t.title}</h1>
                <p className="mt-1 text-sm text-muted">{t.body}</p>
                <a href={href(lang, "/")} className="btn btn-primary mt-3">
                  {t.home}
                </a>
              </section>
            );
          })}
        </main>
      </body>
    </html>
  );
}
