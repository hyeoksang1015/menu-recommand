import { PrivacyPage, privacyMeta } from "@/components/pages/PolicyPages";
import { langOf } from "@/i18n/params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return privacyMeta(await langOf(params));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <PrivacyPage lang={await langOf(params)} />;
}
