import { MenusIndexPage, menusMeta } from "@/components/pages/MenuPages";
import { langOf } from "@/i18n/params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return menusMeta(await langOf(params));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <MenusIndexPage lang={await langOf(params)} />;
}
