import CreditsPage, { creditsMeta } from "@/components/pages/CreditsPage";
import { langOf } from "@/i18n/params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return creditsMeta(await langOf(params));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <CreditsPage lang={await langOf(params)} />;
}
