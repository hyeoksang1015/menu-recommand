import { MenuCategoryPage, categoryMeta } from "@/components/pages/MenuPages";
import { CATEGORIES } from "@/lib/menus";
import { langOf } from "@/i18n/params";

export const dynamicParams = false;
export const generateStaticParams = () =>
  CATEGORIES.map((c) => ({ category: c.key }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  return categoryMeta(await langOf(params), (await params).category);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  return (
    <MenuCategoryPage
      lang={await langOf(params)}
      categoryKey={(await params).category}
    />
  );
}
