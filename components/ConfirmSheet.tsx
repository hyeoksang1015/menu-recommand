"use client";

import { useState } from "react";
import { MenuBadges, MenuThumb } from "@/components/PickCard";
import Sheet from "@/components/Sheet";
import { site } from "@/config/site";
import type { Menu } from "@/lib/engine/types";
import { useMenuStore } from "@/lib/store";

// 확정 후 행동: 근처 찾기, 공유, 먹은 기록 저장.
// 지도는 카카오맵 공식 검색 링크(https://apis.map.kakao.com/web/guide/ "지도 검색결과 바로가기")만 쓴다.
// 네이버는 웹 검색 링크 규격이 공식 문서에 없어(앱 전용 nmap:// 만 있음) 넣지 않았다.
export const kakaoMapUrl = (q: string) =>
  `https://map.kakao.com/link/search/${encodeURIComponent(q)}`;

export default function ConfirmSheet({
  menu,
  onClose,
}: {
  menu: Menu | null;
  onClose: () => void;
}) {
  const recordEaten = useMenuStore((s) => s.recordEaten);
  const [status, setStatus] = useState("");

  const close = () => {
    setStatus("");
    onClose();
  };

  async function share(m: Menu) {
    const text = `오늘은 ${m.name}! 🍚`;
    try {
      if (navigator.share) {
        await navigator.share({ title: site.name, text, url: site.url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${site.url}`);
      setStatus("공유 문구를 복사했어요.");
    } catch (e) {
      // 공유 창을 닫은 경우는 조용히 넘어간다.
      if ((e as Error).name !== "AbortError")
        setStatus("복사하지 못했어요. 주소를 직접 복사해 주세요.");
    }
  }

  return (
    <Sheet open={menu !== null} onClose={close} title="오늘 메뉴 확정!">
      {menu && (
        <>
          <div className="flex items-center gap-4">
            <MenuThumb menu={menu} />
            <div className="space-y-2">
              <p className="text-2xl font-extrabold">{menu.name}</p>
              <MenuBadges menu={menu} />
            </div>
          </div>
          <div className="mt-6 grid gap-2">
            <a
              className="btn btn-primary"
              href={kakaoMapUrl(menu.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              근처 {menu.name} 찾기 (카카오맵)
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => share(menu)}
            >
              공유하기
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                recordEaten(menu.id);
                setStatus("기록했어요. 이틀 동안은 추천에서 빼 둘게요.");
              }}
            >
              먹은 걸로 기록
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
