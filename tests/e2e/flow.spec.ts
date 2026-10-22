import { expect, test, type Page } from "@playwright/test";

const cards = (page: Page, choose = "이걸로!") =>
  page
    .getByRole("listitem")
    .filter({ has: page.getByRole("button", { name: choose }) });
const count = async (page: Page) =>
  Number(await page.getByTestId("candidate-count").textContent());
const names = (page: Page) =>
  cards(page).getByRole("heading").allTextContents();

async function openHome(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "건너뛰기" }).click();
}

async function toPicks(page: Page) {
  await openHome(page);
  const before = await count(page);
  await page.getByRole("button", { name: "3개 골라줘" }).click();
  await expect(page).toHaveURL(/\/picks\/$/);
  await expect(cards(page)).toHaveCount(3);
  return before;
}

test("coach marks show once and can be skipped", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("dialog", { name: "사용 방법 안내" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "건너뛰기" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "3개 골라줘" })).toBeVisible();
  await expect(
    page.getByRole("dialog", { name: "사용 방법 안내" }),
  ).toHaveCount(0);
});

test("home inputs narrow candidates and give three picks from different categories", async ({
  page,
}) => {
  await openHome(page);
  const all = await count(page);
  await page
    .getByRole("group", { name: "오늘 기분" })
    .getByRole("button", { name: "피곤" })
    .click();
  await page.getByRole("slider", { name: "1인 예산" }).fill("10000");
  const narrowed = await count(page);
  expect(narrowed).toBeLessThan(all);
  await page.getByRole("button", { name: "3개 골라줘" }).click();
  await expect(cards(page)).toHaveCount(3);
  // 화면마다 후보 수가 같아야 한다.
  expect(await count(page)).toBe(narrowed);
  const categories = await cards(page)
    .getByRole("heading")
    .locator("span")
    .allTextContents();
  expect(new Set(categories).size).toBe(3);
  await expect(
    cards(page).first().getByRole("list", { name: "추천 이유" }),
  ).toBeVisible();
});

test("rejecting a pick recomputes right away", async ({ page }) => {
  const before = await toPicks(page);
  expect(await count(page)).toBe(before);
  const [first] = await names(page);

  await cards(page).first().getByRole("button", { name: "다른 거" }).click();
  await page.getByRole("button", { name: "어제 먹음" }).click();
  await expect(cards(page)).toHaveCount(3);
  await expect(page.getByTestId("candidate-count")).toHaveText(
    String(before - 1),
  );
  expect(await names(page)).not.toContain(first);

  const [next] = await names(page);
  await cards(page).first().getByRole("button", { name: "다른 거" }).click();
  await page.getByRole("button", { name: "느끼함" }).click();
  await expect(cards(page).first().getByRole("heading")).not.toHaveText(next);
  expect(await names(page)).not.toContain(next);

  // "어제 먹음"은 다음 방문에도 남는다.
  await page.goto("/");
  await expect(page.getByText(/최근 먹은 1개 제외/)).toBeVisible();
});

test("browse, confirm, share and record a meal", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  // 공유 창이 없는 브라우저의 클립보드 대체 경로를 검사한다.
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "share", { value: undefined }),
  );
  const total = await toPicks(page);
  await page.getByRole("link", { name: "직접 고를래요" }).click();
  await expect(page).toHaveURL(/\/browse\/$/);
  await expect(page.getByTestId("candidate-count")).toHaveText(String(total));
  const grid = page
    .getByRole("main")
    .getByRole("list")
    .first()
    .getByRole("button");
  await expect(grid).toHaveCount(Math.min(12, total));

  const name = (await grid.first().locator("span.font-bold").textContent())!;
  await grid.first().click();
  const sheet = page.getByRole("dialog", { name: "오늘 메뉴 확정!" });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("link", { name: /카카오맵/ })).toHaveAttribute(
    "href",
    `https://map.kakao.com/link/search/${encodeURIComponent(name)}`,
  );
  await sheet.getByRole("button", { name: "공유하기" }).click();
  await expect(sheet.getByRole("status")).toHaveText("공유 문구를 복사했어요.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    `오늘은 ${name}!`,
  );
  await sheet.getByRole("button", { name: "먹은 걸로 기록" }).click();
  await expect(sheet.getByRole("status")).toContainText("기록했어요");
  await sheet.getByRole("button", { name: "닫기" }).click();

  await page.goto("/");
  await expect(page.getByTestId("candidate-count")).toHaveText(
    String(total - 1),
  );
  await page.getByRole("button", { name: "3개 골라줘" }).click();
  await expect(cards(page)).toHaveCount(3);
  expect(await names(page)).not.toContain(name);
});

test("dish guide pages list menus without JavaScript", async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto("http://localhost:3100/menus/korean/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("한식");
  await expect(page.getByRole("heading", { name: "김치찌개" })).toBeVisible();
  await page.goto("http://localhost:3100/guides/quick-lunch/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "점심 메뉴, 3분 안에 정하는 법",
  );
});

test("leave-out and match-me panels are open from the start", async ({
  page,
}) => {
  await openHome(page);
  for (const name of ["빼주께", "맞춰주께"]) {
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
  await expect(
    page.getByRole("button", { name: "우유", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("slider", { name: "1인 예산" })).toBeVisible();
});

test("picks show real food photos", async ({ page }) => {
  await toPicks(page);
  const photos = cards(page).locator("img");
  await expect(photos.first()).toBeVisible();
  const widths = await photos.evaluateAll((imgs) =>
    Promise.all(
      (imgs as HTMLImageElement[]).map((img) =>
        img
          .decode()
          .then(() => img.naturalWidth)
          .catch(() => 0),
      ),
    ),
  );
  expect(widths.filter((w) => w > 0).length).toBeGreaterThan(0);
});

test("English pages and the language switcher", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(
    page.getByRole("heading", { name: "Leave out", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pick 3 for me" }).click();
  await expect(page).toHaveURL(/\/en\/picks\/$/);
  await expect(cards(page, "This one!")).toHaveCount(3);

  await page.goto("/en/about/");
  await page.getByRole("combobox", { name: "Language" }).selectOption("ja");
  await expect(page).toHaveURL(/\/ja\/about\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});

const META =
  '<meta name="google-adsense-account" content="ca-pub-4035979084834637"/>';
const GTAG = 'src="https://www.googletagmanager.com/gtag/js?id=G-5MZDBV6NJ1"';

test("Google tag on every page; AdSense tag in content pages but not on the 404 page", async ({
  request,
}) => {
  for (const path of [
    "/",
    "/en/menus/korean/",
    "/guides/allergies/",
    "/privacy/",
  ]) {
    const html = await (await request.get(path)).text();
    const head = html.slice(0, html.indexOf("</head>"));
    expect(head, path).toContain(META);
    expect(head.split(GTAG).length - 1, path).toBe(1);
    const lang = path.startsWith("/en/") ? "en" : "ko";
    expect(head, path).toContain(
      `<meta property="og:image" content="https://menu-recommand-b9q.pages.dev/og/${lang}.png"/>`,
    );
    expect(head, path).toContain(
      '<meta name="twitter:card" content="summary_large_image"/>',
    );
    expect(head, path).toContain(
      'src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4035979084834637" crossorigin="anonymous"',
    );
  }
  // 404에는 광고 스크립트를 넣지 않지만 사이트 확인 메타 태그는 둔다.
  const notFound = await (await request.get("/404.html")).text();
  expect(notFound).not.toContain("adsbygoogle");
  expect(notFound.slice(0, notFound.indexOf("</head>"))).toContain(META);
  expect(notFound.slice(0, notFound.indexOf("</head>"))).toContain(GTAG);
  expect(await (await request.get("/ads.txt")).text()).toContain(
    "google.com, pub-4035979084834637, DIRECT, f08c47fec0942fa0",
  );
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain('hreflang="zh-Hans"');
  expect(sitemap).not.toContain("/picks/");
});
