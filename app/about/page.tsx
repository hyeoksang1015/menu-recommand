import Link from "next/link";
import { pageMeta, site } from "@/config/site";
import { SPICE, won } from "@/lib/labels";
import { CATEGORIES, MENUS } from "@/lib/menus";

export const metadata = pageMeta(
  "소개와 전체 메뉴",
  `${site.name}가 메뉴를 고르는 방법과 전체 메뉴 ${MENUS.length}개 목록.`,
  "/about/",
);

// 긴 설명은 추천 화면이 아니라 이 페이지에 둔다(spec 8절). 서버에서 다 그려 검색에 잡히게 한다.
export default function AboutPage() {
  return (
    <article className="space-y-8 leading-7">
      <header>
        <h1 className="mt-2 text-2xl font-extrabold">
          {site.name}는 이렇게 골라요
        </h1>
        <p className="mt-2 text-muted">
          룰렛처럼 하나를 뽑아 주면 막상 안 끌릴 때가 많아요. 그래서 오늘 상태를
          듣고 후보 3개를 보여 드린 뒤, 마지막 선택은 직접 하도록 만들었어요.
          가입도 서버도 없이 모든 계산은 이 기기 안에서만 해요.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-bold">사용 방법</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted">
          <li>못 먹는 재료나 어제 먹은 메뉴가 있으면 먼저 빼요.</li>
          <li>배고픈 정도, 기분, 같이 먹는 사람, 1인 예산을 골라요.</li>
          <li>
            &ldquo;3개 골라줘&rdquo;를 누르면 서로 다른 종류에서 3개가 나와요.
          </li>
          <li>
            별로면 &ldquo;다른 거&rdquo;를 누르고 이유를 고르면 바로 다시
            골라요. 고른 이유는 다음 추천에도 반영돼요.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-bold">3개는 이렇게 달라요</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
          <li>무난한 선택: 오늘 상태와 평소 취향에 가장 잘 맞는 메뉴</li>
          <li>오늘 상태에 딱: 취향은 빼고 지금 상태만 본 메뉴</li>
          <li>새로운 도전: 아직 덜 본 메뉴 중에서 고른 메뉴</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold">꼭 알아 두세요</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
          <li>
            가격은 1인 기준 대략적인 값이고, 재료 정보는 일반적인 조리법
            기준이에요. 알레르기가 있다면 식당에 꼭 확인하세요.
          </li>
          <li>
            취향과 먹은 기록은 이 브라우저에만 저장돼요. 브라우저 데이터를
            지우면 함께 지워져요.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold">전체 메뉴 {MENUS.length}개</h2>
        {CATEGORIES.map((c) => {
          const list = MENUS.filter((m) => m.category === c.key);
          return (
            <div key={c.key} className="mt-4">
              <h3 className="font-bold">
                {c.emoji} {c.label} ({list.length})
              </h3>
              <ul className="mt-1 grid grid-cols-1 gap-x-4 text-sm text-muted sm:grid-cols-2">
                {list.map((m) => (
                  <li key={m.id}>
                    {m.name} · 약 {won(m.price)} · {SPICE[m.spice]}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <Link href="/" className="btn btn-primary w-full">
        메뉴 고르러 가기
      </Link>
    </article>
  );
}
