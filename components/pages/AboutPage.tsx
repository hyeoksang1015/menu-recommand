import { pageMeta } from "@/config/site";
import { PAGE_TEXT } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/ui";
import { PageHeader, Sections, StartButton } from "./shared";

export const aboutMeta = (lang: Locale) =>
  pageMeta(
    lang,
    PAGE_TEXT[lang].about.title,
    PAGE_TEXT[lang].about.description,
    "/about/",
  );

export default function AboutPage({ lang }: { lang: Locale }) {
  const a = PAGE_TEXT[lang].about;
  return (
    <article>
      <PageHeader title={a.title} />
      {a.intro.map((p) => (
        <p key={p.slice(0, 32)} className="mt-3 leading-7 text-muted">
          {p}
        </p>
      ))}
      <Sections sections={a.sections} />
      <section className="mt-10">
        <h2 className="text-lg font-bold">{a.faqTitle}</h2>
        <dl className="mt-3 space-y-4">
          {a.faq.map((f) => (
            <div key={f.q} className="card">
              <dt className="font-bold">{f.q}</dt>
              <dd className="mt-2 leading-7 text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <StartButton lang={lang} label={getDict(lang).common.start} />
    </article>
  );
}
