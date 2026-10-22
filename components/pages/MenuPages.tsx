import Link from "next/link";
import { MenuPhoto } from "@/components/PickCard";
import { pageMeta } from "@/config/site";
import { CATEGORY_TEXT } from "@/content/categories";
import { PAGE_TEXT } from "@/content/pages";
import { fmt, href, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/ui";
import { priceLabel } from "@/lib/labels";
import {
  ALLERGENS,
  CATEGORIES,
  CATEGORY_BY_KEY,
  MENUS,
  commonsUrl,
  menuName,
} from "@/lib/menus";
import { PageHeader, StartButton } from "./shared";

const menusOf = (key: string) => MENUS.filter((m) => m.category === key);

export const menusMeta = (lang: Locale) =>
  pageMeta(
    lang,
    PAGE_TEXT[lang].menus.title,
    PAGE_TEXT[lang].menus.description,
    "/menus/",
  );

export function categoryMeta(lang: Locale, key: string) {
  const c = CATEGORY_BY_KEY.get(key)!;
  const name = c.label[lang];
  return pageMeta(
    lang,
    `${name} | ${PAGE_TEXT[lang].menus.title}`,
    fmt(PAGE_TEXT[lang].menus.categoryDescription, {
      name,
      count: menusOf(key).length,
    }),
    `/menus/${key}/`,
  );
}

export function MenusIndexPage({ lang }: { lang: Locale }) {
  const p = PAGE_TEXT[lang].menus;
  return (
    <>
      <PageHeader title={p.title} lead={p.intro} />
      <ul className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => {
          const sample = menusOf(c.key).find((m) => m.photo)!;
          return (
            <li key={c.key}>
              <Link
                href={href(lang, `/menus/${c.key}/`)}
                className="card block h-full hover:bg-soft"
              >
                <MenuPhoto menu={sample} />
                <h2 className="mt-3 text-lg font-extrabold">
                  {c.emoji} {c.label[lang]}
                  <span className="ml-2 text-sm font-normal text-muted">
                    {fmt(p.count, { count: menusOf(c.key).length })}
                  </span>
                </h2>
                <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted">
                  {CATEGORY_TEXT[c.key][lang].intro[0]}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      <StartButton lang={lang} label={getDict(lang).common.start} />
    </>
  );
}

export function MenuCategoryPage({
  lang,
  categoryKey,
}: {
  lang: Locale;
  categoryKey: string;
}) {
  const t = getDict(lang);
  const p = PAGE_TEXT[lang].menus;
  const c = CATEGORY_BY_KEY.get(categoryKey)!;
  const text = CATEGORY_TEXT[categoryKey][lang];
  const list = menusOf(categoryKey);
  return (
    <article>
      <p className="mt-2 text-sm">
        <Link href={href(lang, "/menus/")} className="text-link">
          ← {p.back}
        </Link>
      </p>
      <PageHeader title={`${c.emoji} ${c.label[lang]}`} />
      {text.intro.map((para) => (
        <p key={para.slice(0, 32)} className="mt-3 leading-relaxed text-muted">
          {para}
        </p>
      ))}
      <section className="card mt-6">
        <h2 className="font-bold">{p.tipsTitle}</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed text-muted">
          {text.tips.map((tip) => (
            <li key={tip.slice(0, 32)}>{tip}</li>
          ))}
        </ul>
      </section>
      <h2 className="mt-10 text-lg font-bold">
        {p.listTitle} ({list.length})
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {list.map((m) => {
          const allergens = ALLERGENS.filter((a) => m.allergen_mask & a.bit);
          return (
            <li key={m.id} className="card p-3">
              <MenuPhoto menu={m} />
              <h3 className="mt-3 font-extrabold">{menuName(m, lang)}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="badge">{priceLabel(m, lang, t)}</span>
                <span className="badge">{t.menu.spice[m.spice]}</span>
                <span className="badge">
                  {m.hot ? t.menu.hot : t.menu.cold}
                </span>
              </div>
              <p className="mt-2 text-xs leading-snug text-muted">
                {p.allergens}:{" "}
                {allergens.length
                  ? allergens.map((a) => a.label[lang]).join(", ")
                  : p.noAllergens}
              </p>
              {m.photo && (
                <p className="mt-1 text-xs leading-snug text-muted">
                  {p.photoBy}:{" "}
                  <a
                    href={commonsUrl(m.photo.file)}
                    className="underline"
                    rel="nofollow"
                  >
                    {m.photo.author}
                  </a>{" "}
                  ({m.photo.license})
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-xs text-muted">{t.home.allergenNote}</p>
      <StartButton lang={lang} label={t.common.start} />
    </article>
  );
}
