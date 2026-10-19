import Link from "next/link";
import type { ReactNode } from "react";
import { I18nProvider } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import StoreHydrator from "@/components/StoreHydrator";
import { site } from "@/config/site";
import { HTML_LANG, href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/ui";
import "@/app/globals.css";

// 한국어(app/(ko))와 다른 언어(app/[lang]) 루트 레이아웃이 함께 쓰는 html 껍데기.
export default function RootShell({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  const t = getDict(lang);
  const nav = [
    { path: "/", label: t.nav.pick },
    { path: "/menus/", label: t.nav.menus },
    { path: "/guides/", label: t.nav.guides },
    { path: "/about/", label: t.nav.about },
  ];
  return (
    <html lang={HTML_LANG[lang]} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {/* Google AdSense: 모든 콘텐츠 페이지. async 스크립트라 React가 <head>로 올려 준다. 404 화면(app/global-not-found.tsx)에는 넣지 않는다. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsenseClient}`}
          crossOrigin="anonymous"
        />
        <I18nProvider lang={lang} t={t}>
          <StoreHydrator />
          <a
            href="#main"
            className="btn btn-primary sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-30"
          >
            {t.nav.skip}
          </a>
          <header className="mx-auto w-full max-w-xl px-gutter pt-4">
            <div className="flex items-center justify-between gap-3">
              <Link href={href(lang, "/")} className="text-xl font-extrabold">
                🍚 {t.site.name}
              </Link>
              <LanguageSwitcher lang={lang} label={t.nav.language} />
            </div>
            <nav
              aria-label={t.nav.menus}
              className="mt-3 -mx-gutter overflow-x-auto px-gutter"
            >
              <ul className="flex gap-1.5 whitespace-nowrap text-sm">
                {nav.map((n) => (
                  <li key={n.path}>
                    <Link href={href(lang, n.path)} className="chip min-h-9">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          <main
            id="main"
            className="mx-auto w-full max-w-xl flex-1 px-gutter pt-4 pb-16"
          >
            {children}
          </main>
          <footer className="border-t border-line bg-card">
            <div className="mx-auto w-full max-w-xl space-y-3 px-gutter py-6 text-sm text-muted">
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                <li>
                  <Link href={href(lang, "/about/")} className="underline">
                    {t.nav.about}
                  </Link>
                </li>
                <li>
                  <Link href={href(lang, "/privacy/")} className="underline">
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link href={href(lang, "/contact/")} className="underline">
                    {t.footer.contact}
                  </Link>
                </li>
                <li>
                  <Link href={href(lang, "/credits/")} className="underline">
                    {t.footer.credits}
                  </Link>
                </li>
              </ul>
              <p className="text-xs">{t.footer.photoNote}</p>
              <p className="text-xs">© 2026 {t.site.name}</p>
            </div>
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}
