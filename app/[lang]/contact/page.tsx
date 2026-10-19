import { ContactPage, contactMeta } from "@/components/pages/PolicyPages";
import { langOf } from "@/i18n/params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return contactMeta(await langOf(params));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <ContactPage lang={await langOf(params)} />;
}
