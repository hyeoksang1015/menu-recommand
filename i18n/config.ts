// 사이트 언어. 한국어는 접두어 없이(/picks/), 나머지는 /en/picks/ 처럼 접두어를 붙인다.
// 언어를 늘리려면: 여기 LOCALES, i18n/ui/<lang>.ts, content/ 문구, data/menus.csv 의 name_<lang> 열을 추가한다.
export const LOCALES = ["ko", "en", "ja", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export type PrefixedLocale = Exclude<Locale, "ko">;
export const PREFIXED_LOCALES = LOCALES.filter(
  (l): l is PrefixedLocale => l !== "ko",
);

export const HTML_LANG: Record<Locale, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh-Hans",
};
export const INTL_LOCALE: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
};
export const LOCALE_NAME: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "简体中文",
};

export const isLocale = (v: string): v is Locale =>
  (LOCALES as readonly string[]).includes(v);

// 언어별 주소. path는 "/"로 시작하고 끝나는 한국어 기준 경로다.
export function href(lang: Locale, path: string): string {
  return lang === "ko" ? path : `/${lang}${path}`;
}

// 현재 주소에서 언어와 한국어 기준 경로를 분리한다(언어 전환 링크용).
export function splitPath(pathname: string): { lang: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (first && first !== "ko" && isLocale(first)) {
    return { lang: first, path: `/${rest.join("/")}` };
  }
  return { lang: "ko", path: pathname };
}

// "{name}" 자리표시를 채운다. 사전은 서버→클라이언트로 넘겨야 해서 함수 대신 문자열 틀을 쓴다.
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    String(vars[k] ?? ""),
  );
}
