import HomePage, { homeMeta } from "@/components/pages/HomePage";
import { langOf } from "@/i18n/params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return homeMeta(await langOf(params));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <HomePage lang={await langOf(params)} />;
}
