import Link from "next/link";
import CoachMarks from "@/components/CoachMarks";
import InputPanel from "@/components/InputPanel";
import { pageMeta, site } from "@/config/site";
import { GUIDES } from "@/content/guides";
import { PAGE_TEXT } from "@/content/pages";
import { href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/ui";
import { CATEGORIES } from "@/lib/menus";

export const homeMeta = (lang: Locale) => {
  const t = getDict(lang);
  return pageMeta(lang, t.site.homeTitle, t.site.description, "/", {
    absoluteTitle: true,
  });
};

export default function HomePage({ lang }: { lang: Locale }) {
  const t = getDict(lang);
  const about = PAGE_TEXT[lang].about;
  // Google 사이트 이름용 WebSite 데이터. 사이트 이름은 호스트마다 하나라 한국어 홈(/)에만 넣고, 다른 언어 이름은 alternateName으로 둔다.
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: t.site.name,
    alternateName: [getDict("en").site.name, getDict("ja").site.name],
    url: `${site.url}/`,
  };
  return (
    <>
      {lang === "ko" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      )}
      <h1 className="mt-2 text-2xl font-extrabold">{t.home.title}</h1>
      <p className="mt-1 mb-5 text-muted">{t.home.lead}</p>
      <InputPanel />
      <CoachMarks />
      {/* 추천 도구 아래에 서비스 설명을 짧게 둔다. 긴 글은 소개·가이드 페이지에 있다. */}
      <section className="mt-12 space-y-3 text-sm leading-relaxed text-muted">
        <h2 className="text-base font-bold text-ink">
          {about.sections[1].heading}
        </h2>
        <p>{about.sections[1].body[0]}</p>
        <p>{about.sections[2].body[0]}</p>
        <p>
          <Link href={href(lang, "/about/")} className="text-link">
            {t.nav.about}
          </Link>
        </p>
        <h3 className="pt-3 text-base font-bold text-ink">
          <Link href={href(lang, "/guides/")}>{t.nav.guides}</Link>
        </h3>
        <ul className="space-y-1">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                href={href(lang, `/guides/${g.slug}/`)}
                className="text-link"
              >
                {g.text[lang].title}
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="pt-3 text-base font-bold text-ink">
          <Link href={href(lang, "/menus/")}>{t.nav.menus}</Link>
        </h3>
        <ul className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <li key={c.key}>
              <Link href={href(lang, `/menus/${c.key}/`)} className="chip">
                {c.label[lang]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
