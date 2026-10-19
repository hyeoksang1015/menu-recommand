import { GuidePage, guideMeta } from "@/components/pages/GuidePages";
import { GUIDES } from "@/content/guides";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return guideMeta("ko", (await params).slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <GuidePage lang={"ko"} slug={(await params).slug} />;
}
