import { pageMeta, site } from "@/config/site";
import { PAGE_TEXT } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import { PageHeader, Sections } from "./shared";

export const privacyMeta = (lang: Locale) =>
  pageMeta(
    lang,
    PAGE_TEXT[lang].privacy.title,
    PAGE_TEXT[lang].privacy.description,
    "/privacy/",
  );
export const contactMeta = (lang: Locale) =>
  pageMeta(
    lang,
    PAGE_TEXT[lang].contact.title,
    PAGE_TEXT[lang].contact.description,
    "/contact/",
  );

function Email({ label }: { label: string }) {
  return (
    <p className="card mt-6">
      <span className="font-bold">{label}</span>{" "}
      <a href={`mailto:${site.contactEmail}`} className="text-link">
        {site.contactEmail}
      </a>
    </p>
  );
}

export function PrivacyPage({ lang }: { lang: Locale }) {
  const p = PAGE_TEXT[lang].privacy;
  return (
    <article>
      <PageHeader title={p.title} lead={p.updated} />
      <Sections sections={p.sections} />
      <Email label={PAGE_TEXT[lang].contact.emailLabel} />
    </article>
  );
}

export function ContactPage({ lang }: { lang: Locale }) {
  const c = PAGE_TEXT[lang].contact;
  return (
    <article>
      <PageHeader title={c.title} />
      {c.body.map((p) => (
        <p key={p.slice(0, 32)} className="mt-3 leading-7 text-muted">
          {p}
        </p>
      ))}
      <Email label={c.emailLabel} />
    </article>
  );
}
