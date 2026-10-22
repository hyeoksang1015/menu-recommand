import Link from "next/link";
import { pageMeta } from "@/config/site";
import { GUIDES, GUIDE_BY_SLUG } from "@/content/guides";
import { PAGE_TEXT } from "@/content/pages";
import { href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/ui";
import { PageHeader, Sections, StartButton } from "./shared";

export const guidesMeta = (lang: Locale) =>
  pageMeta(
    lang,
    PAGE_TEXT[lang].guides.title,
    PAGE_TEXT[lang].guides.description,
    "/guides/",
  );

export function guideMeta(lang: Locale, slug: string) {
  const g = GUIDE_BY_SLUG.get(slug)!.text[lang];
  return pageMeta(lang, g.title, g.description, `/guides/${slug}/`);
}

function GuideList({ lang, except }: { lang: Locale; except?: string }) {
  // 가이드 글 아래 "다른 가이드" 목록은 그 소제목(h2) 아래에 오므로 한 단계 내린다.
  const Title = except ? "h3" : "h2";
  return (
    <ul className="grid gap-3">
      {GUIDES.filter((g) => g.slug !== except).map((g) => (
        <li key={g.slug}>
          <Link
            href={href(lang, `/guides/${g.slug}/`)}
            className="card block hover:bg-soft"
          >
            <Title className="text-lg font-extrabold">
              <span aria-hidden>{g.emoji}</span> {g.text[lang].title}
            </Title>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {g.text[lang].description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function GuidesIndexPage({ lang }: { lang: Locale }) {
  const p = PAGE_TEXT[lang].guides;
  return (
    <>
      <PageHeader title={p.title} lead={p.intro} />
      <GuideList lang={lang} />
      <StartButton lang={lang} label={getDict(lang).common.start} />
    </>
  );
}

export function GuidePage({ lang, slug }: { lang: Locale; slug: string }) {
  const p = PAGE_TEXT[lang].guides;
  const g = GUIDE_BY_SLUG.get(slug)!.text[lang];
  return (
    <article>
      <p className="mt-2 text-sm">
        <Link href={href(lang, "/guides/")} className="text-link">
          ← {p.back}
        </Link>
      </p>
      <PageHeader title={g.title} lead={g.description} />
      <Sections sections={g.sections} />
      <StartButton lang={lang} label={getDict(lang).common.start} />
      <h2 className="mt-12 mb-3 text-lg font-bold">{p.related}</h2>
      <GuideList lang={lang} except={slug} />
      <p className="mt-6">
        <Link href={href(lang, "/menus/")} className="text-link">
          {PAGE_TEXT[lang].menus.title}
        </Link>
      </p>
    </article>
  );
}
