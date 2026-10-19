import { PicksPage, picksMeta } from "@/components/pages/ToolPages";
import { langOf } from "@/i18n/params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return picksMeta(await langOf(params));
}

export default function Page() {
  return <PicksPage />;
}
