"use client";

import { usePathname } from "next/navigation";
import {
  LOCALES,
  LOCALE_NAME,
  href,
  splitPath,
  type Locale,
} from "@/i18n/config";

// 같은 페이지의 다른 언어로 이동한다. 검색엔진은 <head>의 hreflang으로 언어별 주소를 찾는다.
export default function LanguageSwitcher({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const { path } = splitPath(usePathname());
  return (
    <select
      aria-label={label}
      value={lang}
      onChange={(e) =>
        window.location.assign(href(e.target.value as Locale, path))
      }
      className="min-h-9 rounded-full border border-line bg-card px-3 text-sm"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_NAME[l]}
        </option>
      ))}
    </select>
  );
}
