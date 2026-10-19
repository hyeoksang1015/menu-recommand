import { notFound } from "next/navigation";
import { PREFIXED_LOCALES, type PrefixedLocale } from "@/i18n/config";

// app/[lang] 라우트의 언어 값을 검사한다. 정적 생성 목록에 없는 값이면 404.
export async function langOf(
  params: Promise<{ lang: string }>,
): Promise<PrefixedLocale> {
  const { lang } = await params;
  if (!(PREFIXED_LOCALES as string[]).includes(lang)) notFound();
  return lang as PrefixedLocale;
}
