# 메뉴 추천 웹사이트 구현 명세 (Claude Code 전달용)

작성일: 2026-10-19. 설계 근거 문서: https://claude.ai/code/artifact/2d93aa79-9ac9-411c-ac3e-4393dc36aee9

## 1. 목표

"오늘 뭐 먹지" 선택장애용 모바일 우선 웹사이트. 룰렛처럼 1개를 뽑아주면 추천받아도 안 땡기는 문제가 있어서, **오늘 상태 입력 → 후보 3개 → 사람이 확정** 구조로 만든다.

벤치마킹 대상은 저메추.com과 도구마스터(메뉴선택)이며, **기능과 UX 방식만** 참고한다. 저메추의 메뉴 데이터, 이미지, 캐릭터, 문구는 복제하지 않는다.

## 2. 확정된 결정

| 항목 | 결정 |
| --- | --- |
| 1단계 메뉴 수 | 250개 (카테고리별 배분은 미정, 12절 참고) |
| 서버 | 1단계는 없음. 추천 엔진을 브라우저에서 실행 |
| 로그인 | 없음. 취향·거절·최근 먹은 것은 localStorage |
| 기본 경로 | 홈 입력 4개 + 버튼 1회 → 3픽 |
| 광고 | 1단계에서는 넣지 않음 |

## 3. 기술 스택

- Next.js(App Router) + TypeScript, Tailwind CSS(색·간격은 CSS 변수 토큰), Motion(구 Framer Motion), Zustand + persist(localStorage)
- 데이터: CSV를 Python 스크립트로 JSON 변환, Zod로 빌드 시 검증
- 테스트: Vitest(엔진), Playwright(플로우), Lighthouse CI(화면 밀림 CLS, LCP)
- 배포: Vercel 또는 Cloudflare Pages

선택 근거: 추천 플로우는 클라이언트 상호작용이 크고 SEO 페이지(소개, 메뉴 목록)도 필요해서 정적 생성과 클라이언트 렌더링을 한 프로젝트에서 쓴다. Streamlit은 제스처, 커스텀 UI, SEO, 라이브 카운터에 맞지 않아 제외했다. 엔진을 서버가 아니라 브라우저에 두는 이유는 필터를 바꿀 때마다 후보 수가 즉시 갱신되어야 하기 때문이다.

## 4. 디렉터리 구조 (제안)

```
app/                    # 라우트: / (홈), /picks, /browse, /about
components/             # InputPanel, PickCard, RejectSheet, BrowseGrid, CoachMarks
lib/engine/             # 추천 엔진 (순수 함수, UI 의존 없음)
lib/store.ts            # Zustand 상태 + persist
config/mood.ts          # 기분 칩 → 쿼리 매핑 (가설, 한 파일에서 조정)
data/menus.csv          # 원본 데이터
scripts/build_menus.py  # CSV → public/menus.json + 검증 (Python, PEP8)
reference/engine.py     # 파이썬 참조 구현 (첨부된 engine.py를 여기에 둔다)
tests/golden/           # 참조 구현이 만든 테스트 벡터 (JSON)
```

## 5. 화면 5개

| 화면 | 목적 | 핵심 요소 |
| --- | --- | --- |
| 홈(오늘의 상태) | 입력 4개 | 허기(가볍게~든든), 기분 칩(스트레스·피곤·평범·기념), 동행 칩(혼자·둘·여럿), 예산 상한 슬라이더(5천 원 단위). 접힘: 못 먹는 것, 어제 먹은 것 |
| 3픽 결과 | 비교 후 선택 | 카드 3장: 사진, 가격대, 맵기·국물 배지, 이유 칩 3개 |
| 다른 거 | 거절을 학습으로 | 사유 칩 4개 1탭 후 즉시 재산출 |
| 직접 고르기 | 후보 12개 이하에서 탐색 | 카드 그리드, 가격 배지 |
| 확정 | 결정 후 행동 | 근처 찾기(지도 앱 검색 링크), 공유 링크, 먹은 기록 저장 |

흐름: 홈 → 3픽 → (마음에 듦 → 확정) / (아니요 → 다른 거 → 재산출 → 3픽) / (직접 고를래요 → 직접 고르기 → 확정).

월드컵, 같이 정하기, 스와이프는 1단계 범위 밖이다.

## 6. 추천 엔진 계약

`reference/engine.py`가 기준 구현이다. 같은 동작을 `lib/engine/`에 TypeScript로 옮기고, 참조 구현이 생성한 골든 벡터로 결과 일치를 검사한다.

**데이터 타입**

- `Menu`: id, name, category, category_bit, allergen_mask, price(원), spice(0~5), heavy(0~1), oily(0~1), hot(bool)
- `Query`: ban_allergen, ban_category, max_price, max_spice, max_oily, want_heavy, want_hot(null 가능), recent(id 집합)

**처리 순서**

1. 하드 필터 `passes`: 알레르기·카테고리는 비트 AND, 가격·맵기·기름기 상한, recent 제외. 항목당 O(1)이라 전체 O(N)
2. 3픽 `pick_three`: 필터 1회 + 선형 스캔 3회, 전체 O(N). 슬롯 순서는 safe → mood → novel, 앞선 픽과 **다른 카테고리**여야 한다
3. 직접 고르기 `shortlist`: 상위 k=12, heapq.nlargest에 해당하는 O(N log k)
4. 이유 칩 `explain`: 픽마다 조건 비교, 실제로 맞는 이유만 표시
5. 거절 `apply_rejection`: 새 객체를 반환(입력 불변), O(1)

**점수** (가중치는 초기값, 사용 로그로 조정)

```
state(m) = 0.5 * (1 - |heavy_m - want_heavy|) + 0.5 * [hot_m == want_hot]   # want_hot이 null이면 앞 항만
safe  = state(m) + pref[category]
mood  = state(m)
novel = 1 / (1 + seen[m.id]) + 0.5 * state(m)
```

**거절 사유 → 동작**

| 화면 문구 | 코드 | 동작 |
| --- | --- | --- |
| 어제 먹음 | ate_recently | recent에 id 추가 |
| 느끼함 | too_greasy | max_oily = 해당 메뉴 oily - 0.1 |
| 비쌈 | too_pricey | max_price = 해당 메뉴 price - 1 |
| 그냥 싫음 | dislike | pref[category] -= 0.3 |

알 수 없는 사유는 ValueError를 던진다. 후보가 3개 미만이면 만들 수 있는 만큼만 반환한다(예외 없음).

## 7. 홈 입력 → Query 변환

| 입력 | 변환 |
| --- | --- |
| 허기 슬라이더 | want_heavy (0~1) |
| 예산 슬라이더 | max_price |
| 못 먹는 것 | ban_allergen, ban_category |
| 어제 먹은 것 | recent (선택 기록에서 자동 반영 + 직접 입력) |
| 기분 칩 | `config/mood.ts`의 매핑 (아래 가설) |
| 동행 칩 | 값은 저장하되 1단계에서는 필터에 쓰지 않음. Menu에 `solo_ok` 같은 필드가 생기면 연결 |

기분 매핑은 **가설**이다. 초기값 제안: 피곤 → want_heavy 0.8, want_hot true / 스트레스 → want_heavy 0.7, max_spice 5 / 평범 → 기본값 / 기념 → max_price를 슬라이더 값 그대로 두고 novel 슬롯 가중 상향. 사용자 테스트 5~10명 후 고친다.

## 8. 사용방법 안내 (구현 규칙)

- 결과 자리가 비었을 때 다음 행동 한 줄을 보여준다 ("다 고르면 3개 골라드려요").
- 코치마크는 첫 방문 1회, 최대 3단계, 항상 "건너뛰기"를 둔다.
- 입력 중 후보 카운터를 보여준다. 시간대 등 암묵 필터가 있으면 칩으로 드러낸다 (예: "아침 메뉴 42개 · 전체 보기"). 화면마다 후보 수가 달라지면 안 된다.
- 슬라이더 양 끝과 중간에 설명을 붙인다 (예: 맵기는 "안 매움 ~ 아주 매움").
- 모든 질문에 "상관없어" 탈출구를 두고, 제외 질문을 먼저 둔다.
- 마스코트는 동작 확인용 짧은 말풍선에만 쓰고, 캐릭터는 새로 제작한다.
- 긴 설명문은 추천 플로우 화면에 넣지 않고 `/about` 같은 SEO 페이지로 분리한다.

## 9. 코드 스타일 (사용자 지정)

- **Python**: PEP8(79열), Google 스타일 독스트링(Description / Args / Returns / Raises), `import` 문끼리 먼저, `from` 문끼리 그다음으로 묶기, 전 함수 타입 힌트, 큰따옴표 통일, 시간복잡도가 가장 효율적인 방식 선택
- **TypeScript**: Prettier 기본값 + ESLint로 하나의 스타일만 고정
- 코드를 만들 때마다 짧은 설명을 함께 제공하고, 핵심 함수에는 시간복잡도를 주석으로 적는다.

## 10. 구현 순서와 완료 기준

1. 프로젝트 생성, 린트·포맷·테스트 설정 → `npm run lint`, `npm test` 통과
2. `reference/engine.py`로 골든 벡터 생성 → `tests/golden/*.json`
3. `lib/engine/` 이식 → Vitest가 모든 골든 벡터와 일치
4. `scripts/build_menus.py`로 샘플 데이터(20~30개) 변환·검증 → 잘못된 값(예: 맵기 7)에서 실패하는지 확인
5. 홈 → 3픽 → 다른 거 흐름 구현 → Playwright로 기본 경로와 거절 경로 통과
6. 직접 고르기, 확정(지도 링크, 공유 링크) 구현
7. 250개 데이터 투입, Lighthouse CI에서 CLS 확인

각 단계가 끝나면 무엇을 만들었고 무엇을 검증했는지 한두 줄로 보고한다.

## 11. 품질 기준

- 추천 한 번은 O(N). N=230에서 Python 참조 구현이 0.09ms였고(합성 데이터, 샌드박스 측정), 250개는 선형 추정으로 0.1ms 안팎이다. TS 버전은 별도로 측정한다.
- 광고를 나중에 넣게 되면 슬롯 높이를 미리 확보하고 CTA·결과 카드 주변에는 두지 않는다. 도구마스터에서 광고 로딩 중 화면이 밀리고 첫 클릭에서 결과가 나오지 않는 현상이 관측됐다.
- 접근성: 카드 조작은 버튼으로도 가능해야 한다.

## 12. 아직 정해지지 않은 것

- 250개의 카테고리별 배분 (균형을 맞추되 구체 비율 미정)
- 메뉴 이미지 제작 방식(자체 제작 또는 라이선스 확보)과 마스코트 디자인
- 지도 검색 링크 형식(네이버·카카오): 구현 시 각 공식 문서로 확인
- 날씨 연동은 1단계 범위에서 제외. 도입 시 공공 날씨 API의 상업 이용 약관을 먼저 확인
- 메뉴에 국물, 동행 적합도, 시간대 필드를 추가할지 (추가하면 엔진과 골든 벡터를 함께 갱신)

## 13. 하지 않는 것 (1단계)

월드컵, 같이 정하기, 스와이프 모드, 로그인, 서버·DB, 자연어 입력, 광고, 날씨 연동.
