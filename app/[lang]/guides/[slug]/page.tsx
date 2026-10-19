import { GuidePage, guideMeta } from "@/components/pages/GuidePages";
import { GUIDES } from "@/content/guides";
import { langOf } from "@/i18n/params";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  return guideMeta(await langOf(params), (await params).slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  return <GuidePage lang={await langOf(params)} slug={(await params).slug} />;
}
