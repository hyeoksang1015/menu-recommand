import type { MetadataRoute } from "next";
import { languageAlternates, site } from "@/config/site";
import { GUIDES } from "@/content/guides";
import { LOCALES, href } from "@/i18n/config";
import { CATEGORIES } from "@/lib/menus";

export const dynamic = "force-static";

// 콘텐츠 페이지만 넣는다. 3픽·직접 고르기는 개인 입력에 따라 달라지는 화면이라 뺀다.
const PATHS = [
  "/",
  "/about/",
  "/menus/",
  ...CATEGORIES.map((c) => `/menus/${c.key}/`),
  "/guides/",
  ...GUIDES.map((g) => `/guides/${g.slug}/`),
  "/privacy/",
  "/contact/",
  "/credits/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => site.url + p;
  return PATHS.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: abs(href(lang, path)),
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([k, v]) => [k, abs(v)]),
        ),
      },
    })),
  );
}
