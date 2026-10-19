import AboutPage, { aboutMeta } from "@/components/pages/AboutPage";
import { langOf } from "@/i18n/params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return aboutMeta(await langOf(params));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <AboutPage lang={await langOf(params)} />;
}
