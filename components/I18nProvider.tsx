"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/ui";

// 레이아웃이 그 언어의 사전 하나만 넘겨 주므로 클라이언트 번들에 다른 언어 문구가 섞이지 않는다.
const I18nContext = createContext<{ lang: Locale; t: Dict } | null>(null);

export function I18nProvider({
  lang,
  t,
  children,
}: {
  lang: Locale;
  t: Dict;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ lang, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
