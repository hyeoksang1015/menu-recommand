import { expect, test, type Page } from "@playwright/test";

const cards = (page: Page) =>
  page
    .getByRole("listitem")
    .filter({ has: page.getByRole("button", { name: "이걸로!" }) });
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
  const grid = page.getByRole("list").last().getByRole("button");
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

test("about page lists every menu without JavaScript", async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto("http://localhost:3100/about/");
  await expect(
    page.getByRole("heading", { name: /전체 메뉴 \d+개/ }),
  ).toBeVisible();
  await expect(page.getByText(/김치찌개 · 약/)).toBeVisible();
});
