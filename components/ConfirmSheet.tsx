"use client";

import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { MenuBadges, MenuPhoto } from "@/components/PickCard";
import Sheet from "@/components/Sheet";
import { site } from "@/config/site";
import { fmt, href } from "@/i18n/config";
import { menuName, type MenuItem } from "@/lib/menus";
import { useMenuStore } from "@/lib/store";

// 확정 후 행동: 근처 찾기, 공유, 먹은 기록 저장.
// 한국어는 카카오맵 공식 검색 링크(https://apis.map.kakao.com/web/guide/ "지도 검색결과 바로가기"),
// 다른 언어는 Google 지도 공식 검색 URL(https://developers.google.com/maps/documentation/urls/get-started)을 쓴다.
// 네이버는 웹 검색 링크 규격이 공식 문서에 없어(앱 전용 nmap:// 만 있음) 넣지 않았다.
export const kakaoMapUrl = (q: string) =>
  `https://map.kakao.com/link/search/${encodeURIComponent(q)}`;
export const googleMapUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function ConfirmSheet({
  menu,
  onClose,
}: {
  menu: MenuItem | null;
  onClose: () => void;
}) {
  const { lang, t } = useI18n();
  const c = t.confirm;
  const recordEaten = useMenuStore((s) => s.recordEaten);
  const [status, setStatus] = useState("");

  const close = () => {
    setStatus("");
    onClose();
  };

  async function share(name: string) {
    const text = fmt(c.shareText, { name });
    const url = site.url + href(lang, "/");
    try {
      if (navigator.share) {
        await navigator.share({ title: t.site.name, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setStatus(c.shared);
    } catch (e) {
      // 공유 창을 닫은 경우는 조용히 넘어간다.
      if ((e as Error).name !== "AbortError") setStatus(c.shareFail);
    }
  }

  const name = menu ? menuName(menu, lang) : "";
  return (
    <Sheet open={menu !== null} onClose={close} title={c.title}>
      {menu && (
        <>
          <MenuPhoto menu={menu} />
          <div className="mt-3 space-y-2">
            <p className="text-2xl font-extrabold">{name}</p>
            <MenuBadges menu={menu} />
          </div>
          <div className="mt-5 grid gap-2">
            <a
              className="btn btn-primary"
              href={lang === "ko" ? kakaoMapUrl(name) : googleMapUrl(name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {fmt(lang === "ko" ? c.mapKakao : c.mapGoogle, { name })}
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => share(name)}
            >
              {c.share}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                recordEaten(menu.id);
                setStatus(c.recorded);
              }}
            >
              {c.record}
            </button>
          </div>
          <p
            className="mt-3 min-h-5 text-center text-sm text-muted"
            role="status"
          >
            {status}
          </p>
        </>
      )}
    </Sheet>
  );
}
