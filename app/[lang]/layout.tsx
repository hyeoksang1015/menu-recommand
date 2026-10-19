import type { ReactNode } from "react";
import RootShell from "@/components/RootShell";
import { rootMeta } from "@/config/site";
import { PREFIXED_LOCALES } from "@/i18n/config";
import { langOf } from "@/i18n/params";

// 영어·일본어·중국어 루트 레이아웃(/en/, /ja/, /zh/).
export const dynamicParams = false;
export const generateStaticParams = () =>
  PREFIXED_LOCALES.map((lang) => ({ lang }));
export { viewport } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return rootMeta(await langOf(params));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  return <RootShell lang={await langOf(params)}>{children}</RootShell>;
}
