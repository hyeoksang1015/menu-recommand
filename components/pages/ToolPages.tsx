import BrowseGrid from "@/components/BrowseGrid";
import PicksView from "@/components/PicksView";
import { pageMeta } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/ui";

// 3픽·직접 고르기는 각자 입력에 따라 달라지는 화면이라 검색 결과에 넣지 않는다(noindex).
export const picksMeta = (lang: Locale) =>
  pageMeta(
    lang,
    getDict(lang).picks.title,
    getDict(lang).site.description,
    "/picks/",
    {
      noindex: true,
    },
  );
export const browseMeta = (lang: Locale) =>
  pageMeta(
    lang,
    getDict(lang).browse.title,
    getDict(lang).site.description,
    "/browse/",
    {
      noindex: true,
    },
  );

export const PicksPage = () => <PicksView />;
export const BrowsePage = () => <BrowseGrid />;
