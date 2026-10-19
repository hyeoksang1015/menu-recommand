# 골라주께 (menu-recommand)

빼 줄 것(빼주께)과 맞춰 줄 것(맞춰주께)만 고르면 메뉴 후보 3개를 골라 주는 모바일 우선 웹사이트입니다. 설계는 [spec.md](spec.md)에 있습니다.
서버 없이 추천 엔진이 브라우저에서 돌고, 취향과 먹은 기록은 localStorage에만 저장합니다. 한국어·영어·일본어·중국어(간체)를 지원합니다.

## 실행과 검증

```bash
npm install
npm run dev            # http://localhost:3000

npm run data           # data/menus.csv + data/photos.csv → public/menus.json (검증 실패 시 종료 코드 1, 파일을 쓰지 않음)
npm run test:py        # 데이터 스크립트 단위 테스트 + ruff(PEP8 79열, Google 독스트링, import 정렬)
npm run golden         # reference/engine.py로 tests/golden/*.json 재생성
npm test               # Vitest: 골든 벡터 일치, 입력 변환, 메뉴 JSON, 번역 사전 키 일치
npm run lint && npm run format:check
npm run build          # 정적 내보내기(out/). menus.json이 잘못되면 Zod 검증으로 빌드 실패
npm run e2e            # Playwright: out/을 띄워 추천 흐름, 영어 화면·언어 전환, 사진, 애드센스 위치 검사
npm run lhci           # Lighthouse CI: CLS 0.1 초과면 실패, LCP 2.5초 초과는 경고
```

처음 한 번은 `npx playwright install chromium`이 필요합니다. Python 3.12, Pillow, ruff를 씁니다.

## 구조

| 경로 | 역할 |
| --- | --- |
| `reference/engine.py` | 추천 엔진 기준 구현(spec 6절). 동점이면 목록에서 앞선 메뉴가 이긴다 |
| `lib/engine/` | 엔진 TypeScript 이식(순수 함수). 골든 벡터와 결과가 같아야 한다 |
| `config/mood.ts` | 홈 입력 → Query 변환, 기분 매핑 가설(사용자 테스트 뒤 여기서만 조정) |
| `lib/store.ts` | Zustand 상태 + localStorage 저장. 거절로 바뀐 쿼리는 이번 방문에만 쓴다 |
| `lib/menus.ts` | `public/menus.json`을 Zod로 검증해 내보낸다. `menuName(m, lang)` |
| `data/menus.csv` | 메뉴 원본 250개(이름 4개 언어, 8개 카테고리, 1인 기준 대략 가격) |
| `data/photos.csv` | 메뉴별 Wikimedia Commons 사진 파일·작가·라이선스. `file`이 `-`이면 일부러 사진 없음 |
| `scripts/build_menus.py` | CSV 검증·변환. 카테고리·알레르기 목록과 언어별 라벨은 여기에만 정의한다 |
| `scripts/fetch_photos.py` | Commons 검색·내려받기 → `public/photos/{id}.webp`(480×360) |
| `i18n/` | 언어 설정(`config.ts`), 화면 문구 사전(`ui/ko.ts`가 원본, 나머지는 `satisfies Dict`) |
| `content/` | 소개·정책·메뉴 백과·가이드 글(4개 언어). 서버에서만 읽는다 |
| `app/(ko)/`, `app/[lang]/` | 한국어(접두어 없음)와 en/ja/zh 라우트. 페이지 파일은 `components/pages/*`를 부르는 얇은 래퍼 |
| `components/RootShell.tsx` | 두 루트 레이아웃이 함께 쓰는 html 껍데기(내비, 푸터, 애드센스 스크립트) |
| `app/global-not-found.tsx` | 루트 레이아웃이 둘이라 따로 둔 전역 404(애드센스 없음) |

### 사진 바꾸기

1. 후보 보기: `python scripts/fetch_photos.py --candidates <메뉴id> [검색어]`
2. `data/photos.csv`에서 그 메뉴의 `file`을 고른 Commons 파일 이름으로 바꾸고 `public/photos/<id>.webp`를 지운다.
3. `python scripts/fetch_photos.py && npm run data` (작가·라이선스는 Commons에서 다시 채운다)

사진은 CC0·퍼블릭 도메인·CC BY·CC BY-SA만 쓰고, `/credits/` 페이지와 메뉴 백과에 작가·라이선스·원본 링크를 표시한다. 사진이 없는 14개 메뉴는 카테고리 이모지로 보여 준다.

### 언어 추가하기

`i18n/config.ts`의 `LOCALES`, `i18n/ui/<lang>.ts`, `content/`의 각 글, `data/menus.csv`의 `name_<lang>` 열, `scripts/build_menus.py`의 라벨을 추가한다. 빠진 키는 tsc와 `tests/i18n.test.ts`가 잡는다.

## 애드센스

- 자동 광고 스크립트(`ca-pub-4035979084834637`)를 모든 콘텐츠 페이지 `<head>`에 넣었다. 404 화면에는 넣지 않는다. 게시자 ID는 `config/site.ts`의 `site.adsenseClient` 한 곳에서 관리한다.
- `public/ads.txt`, 개인정보처리방침(광고 쿠키·맞춤 광고 해제 안내), 문의 페이지(이메일)를 둔다.
- 콘텐츠: 메뉴 백과(카테고리 8개, 소개 글과 팁), 가이드 4편, 소개·FAQ. 메뉴별 개별 페이지 250개는 얇은 중복 페이지가 되므로 만들지 않았다.
- 3픽·직접 고르기는 개인 입력 화면이라 noindex이고 sitemap에서 뺐다.

## spec과 다르거나 덧붙인 점

- `Query.novel_weight`(기본 1.0)를 추가했다. "기념" 기분의 novel 슬롯 가중 상향(spec 7절)에 필요하다.
- "그냥 싫음"은 엔진에서 취향(pref)만 낮춰 mood 슬롯에 같은 메뉴가 다시 나올 수 있다. 그래서 화면 쪽(`lib/store.ts`)에서 거절한 메뉴를 이번 방문 동안 후보에서 뺀다.
- 기분이 정하는 허기 기본값보다 허기 슬라이더를 직접 움직인 값이 우선한다.
- 근처 찾기: 한국어는 카카오맵 공식 검색 링크, 다른 언어는 Google 지도 공식 검색 URL. 네이버는 웹 검색 URL이 공식 문서에 없다(앱 전용 `nmap://`만 있음).
- 알레르기 정보는 일반적인 조리법 기준의 추정치이며, 화면과 소개·가이드 페이지에 식당에 확인하라는 안내를 둔다.

## 배포 (Cloudflare Pages)

GitHub `main`에 푸시하면 Cloudflare Pages가 빌드합니다. 대시보드에서 이 저장소를 연결할 때의 설정은 다음과 같습니다.

- Framework preset: None, Build command: `npm run build`, Root directory: 비움
- 출력 폴더는 `wrangler.toml`의 `pages_build_output_dir = "./out"`이 정한다. 이 파일을 지우면 소스 폴더 전체가 올라가 첫 화면이 404가 된다.
- `.node-version`의 22를 빌드 Node 버전으로 쓴다.
- 실제 주소가 `https://menu-recommand.pages.dev`와 다르면 환경 변수 `NEXT_PUBLIC_SITE_URL`을 설정하거나 `config/site.ts`를 고친다(canonical, hreflang, sitemap, 공유 링크에 쓰임).
- `scripts/fix-export.mjs`는 Windows 빌드에서만 생기는 Next.js 내보내기 경로 문제를 고친다. Linux 빌드에서는 아무것도 하지 않는다.
