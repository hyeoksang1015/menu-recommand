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
