import { test, expect } from "@playwright/test";
import { mockGameCatalogAPI } from "../../mocks/game-catalog-mocks";

const DEFAULT_LOCALE = "en";

test.describe("Game Catalog", () => {
  test.beforeEach(async ({ page }) => {
    await mockGameCatalogAPI(page);
    // Clear platforms-cache to ensure we use specific mock data and avoid crash from stale/bad cache
    await page.addInitScript(() => {
      window.localStorage.removeItem("platforms-cache");
    });
    await page.goto(`/${DEFAULT_LOCALE}/game-catalog`);
  });

  test("Initial Page Rendering", async ({ page }) => {
    // Check Filter Sidebar presence (checking title text as testid is on inner p)
    await expect(page.getByText(/filters/i).first()).toBeVisible();

    // Check Sort Options - Verify default value
    await expect(page.getByRole("combobox")).toHaveValue("score-desc");

    // Check Game Cards (from mock)
    await expect(page.getByText("The Legend of Zelda: Breath of the Wild")).toBeVisible();
    await expect(page.getByText("God of War Ragnarök")).toBeVisible();
  });

  test("Filtering by Genre", async ({ page }) => {
    // Check loading complete (Action checkbox visible)
    const actionGenre = page.getByTestId("checkbox-1");
    // Force visibility check with longer timeout in case of skeleton
    await expect(actionGenre).toBeVisible();

    // Check it
    await actionGenre.check({ force: true });
    await expect(actionGenre).toBeChecked();

    // Verify URL updates to include genre
    await expect(page).toHaveURL(/genres=1/);
  });

  test("Sorting Games", async ({ page }) => {
    // Native select interaction
    const sortSelect = page.getByRole("combobox");
    await expect(sortSelect).toBeVisible();

    // Select "Name (A-Z)" (value="name-asc")
    await sortSelect.selectOption("name-asc");

    // Check value update
    await expect(sortSelect).toHaveValue("name-asc");
  });

  test("Empty State", async ({ page }) => {
    // Trigger empty search
    await page.route(/\/api\/games(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [], meta: { total: 0, page: 1, totalPages: 0 } }),
      });
    });
    await page.reload();

    await expect(page.getByText(/nenhum jogo encontrado|no games found/i)).toBeVisible();
  });

  test("Error State", async ({ page }) => {
    await page.route(/\/api\/games(\?.*)?$/, async (route) => {
      await route.fulfill({ status: 500 });
    });
    await page.reload();

    // Use heading to be specific and avoid strict violation
    await expect(page.getByRole("heading", { name: /erro|error/i })).toBeVisible();
  });
});
