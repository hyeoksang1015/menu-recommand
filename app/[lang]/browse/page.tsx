import { BrowsePage, browseMeta } from "@/components/pages/ToolPages";
import { langOf } from "@/i18n/params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return browseMeta(await langOf(params));
}

export default function Page() {
  return <BrowsePage />;
}
