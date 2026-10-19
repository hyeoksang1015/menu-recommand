import { MenuCategoryPage, categoryMeta } from "@/components/pages/MenuPages";
import { CATEGORIES } from "@/lib/menus";

export const dynamicParams = false;
export const generateStaticParams = () =>
  CATEGORIES.map((c) => ({ category: c.key }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return categoryMeta("ko", (await params).category);
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return <MenuCategoryPage lang={"ko"} categoryKey={(await params).category} />;
}
