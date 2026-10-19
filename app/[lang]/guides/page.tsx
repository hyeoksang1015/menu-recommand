import { GuidesIndexPage, guidesMeta } from "@/components/pages/GuidePages";
import { langOf } from "@/i18n/params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return guidesMeta(await langOf(params));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <GuidesIndexPage lang={await langOf(params)} />;
}
