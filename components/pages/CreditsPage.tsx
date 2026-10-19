import { pageMeta } from "@/config/site";
import { PAGE_TEXT } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import { CATEGORIES, MENUS, commonsUrl, menuName } from "@/lib/menus";
import { PageHeader } from "./shared";

export const creditsMeta = (lang: Locale) =>
  pageMeta(
    lang,
    PAGE_TEXT[lang].credits.title,
    PAGE_TEXT[lang].credits.description,
    "/credits/",
  );

// CC BY / CC BY-SA 사진의 출처 표시: 작가, 라이선스(링크), 원본 페이지를 메뉴별로 적는다.
export default function CreditsPage({ lang }: { lang: Locale }) {
  const p = PAGE_TEXT[lang].credits;
  return (
    <article>
      <PageHeader title={p.title} lead={p.intro} />
      {CATEGORIES.map((c) => (
        <section key={c.key} className="mt-8">
          <h2 className="text-lg font-bold">
            {c.emoji} {c.label[lang]}
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-6 text-muted">
            {MENUS.filter((m) => m.category === c.key).map((m) => (
              <li key={m.id}>
                <span className="font-semibold text-ink">
                  {menuName(m, lang)}
                </span>
                {" — "}
                {m.photo ? (
                  <>
                    {m.photo.author},{" "}
                    <a
                      href={m.photo.license_url}
                      className="underline"
                      rel="license nofollow"
                    >
                      {m.photo.license}
                    </a>
                    ,{" "}
                    <a
                      href={commonsUrl(m.photo.file)}
                      className="underline"
                      rel="nofollow"
                    >
                      {p.source}
                    </a>
                  </>
                ) : (
                  p.noPhoto
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
