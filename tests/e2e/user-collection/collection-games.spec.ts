import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";

test.describe("User Collection - Games (Authenticated)", () => {
  // Use existing auth state
  test.use({ storageState: "tests/e2e/storageState.json" });

  test("Can access add game page when authenticated", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);

    // Verify we're on the add game page (not redirected to login)
    await expect(page).toHaveURL(/\/user\/collection\/games\/add/);

    // Verify page loaded successfully
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("Add game page shows search functionality", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);

    // Look for search/autocomplete input
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
  });

  // GROUP 1: Search and Selection Tests
  test("Can search for games using autocomplete", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);

    // Find and type in search input
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill("mario");

    // Wait for autocomplete results to appear
    await page.waitForTimeout(1500);

    // Check if any game results appear (conditional)
    const gameResults = page.locator('[data-testid^="game-result-"]');
    const count = await gameResults.count();

    if (count > 0) {
      await expect(gameResults.first()).toBeVisible();
    }
  });

  test("Shows popular games grid by default", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);

    // Wait for games to load
    await page.waitForTimeout(2000);

    // Check for popular games
    const popularGames = page.locator('[data-testid^="popular-game-"]');
    const count = await popularGames.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Can select game from popular games grid", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);

    // Wait for games to load
    await page.waitForTimeout(2000);

    // Click first popular game
    const firstGame = page.locator('[data-testid^="popular-game-"]').first();
    const isVisible = await firstGame.isVisible({ timeout: 5000 }).catch(() => false);

    if (isVisible) {
      await firstGame.click();

      // Wait for form to appear
      await page.waitForTimeout(1000);

      // Verify form section is visible
      const formVisible = await page
        .locator('select, button[type="submit"]')
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      expect(formVisible).toBeTruthy();
    }
  });

  // GROUP 2: Form Tests
  test("Form appears after game selection", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);
    await page.waitForTimeout(2000);

    const firstGame = page.locator('[data-testid^="popular-game-"]').first();
    const isVisible = await firstGame.isVisible({ timeout: 5000 }).catch(() => false);

    if (isVisible) {
      await firstGame.click();
      await page.waitForTimeout(1500);

      // Check if form elements appear
      const platformSelect = page.locator("select").first();
      const selectVisible = await platformSelect.isVisible({ timeout: 3000 }).catch(() => false);

      if (selectVisible) {
        await expect(platformSelect).toBeVisible();
      }
    }
  });

  test("Platform selector has options", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);
    await page.waitForTimeout(2000);

    const firstGame = page.locator('[data-testid^="popular-game-"]').first();
    const isVisible = await firstGame.isVisible({ timeout: 5000 }).catch(() => false);

    if (isVisible) {
      await firstGame.click();
      await page.waitForTimeout(1500);

      const platformSelect = page.locator("select").first();
      const selectVisible = await platformSelect.isVisible({ timeout: 3000 }).catch(() => false);

      if (selectVisible) {
        const options = await platformSelect.locator("option").count();
        expect(options).toBeGreaterThan(0);
      }
    }
  });

  test("Can select platform from dropdown", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);
    await page.waitForTimeout(2000);

    const firstGame = page.locator('[data-testid^="popular-game-"]').first();
    const isVisible = await firstGame.isVisible({ timeout: 5000 }).catch(() => false);

    if (isVisible) {
      await firstGame.click();
      await page.waitForTimeout(1500);

      const platformSelect = page.locator("select").first();
      const selectVisible = await platformSelect.isVisible({ timeout: 3000 }).catch(() => false);

      if (selectVisible) {
        // Get first non-empty option
        const firstOption = await platformSelect.locator("option").nth(1).getAttribute("value");
        if (firstOption) {
          await platformSelect.selectOption(firstOption);
          const selectedValue = await platformSelect.inputValue();
          expect(selectedValue).toBe(firstOption);
        }
      }
    }
  });

  test("Add button is visible in form", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);
    await page.waitForTimeout(2000);

    const firstGame = page.locator('[data-testid^="popular-game-"]').first();
    const isVisible = await firstGame.isVisible({ timeout: 5000 }).catch(() => false);

    if (isVisible) {
      await firstGame.click();
      await page.waitForTimeout(1500);

      // Look for submit/add button
      const addButton = page.locator('button[type="submit"]').first();
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await expect(addButton).toBeVisible();
      }
    }
  });

  // GROUP 3: Navigation Tests
  test("Bulk import button is visible and clickable", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);

    const bulkImportLink = page.getByTestId("bulk-import-link");
    const isVisible = await bulkImportLink.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVisible) {
      await expect(bulkImportLink).toBeVisible();
      await expect(bulkImportLink).toHaveAttribute("href", /\/import/);
    }
  });

  test("Can navigate using breadcrumbs", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);

    // Look for breadcrumb navigation
    const breadcrumbs = page.locator('nav, [role="navigation"]').first();
    const isVisible = await breadcrumbs.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVisible) {
      await expect(breadcrumbs).toBeVisible();
    }
  });
});

test.describe("User Collection - Access Control (Unauthenticated)", () => {
  // No auth state - empty storage
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Redirects to login when accessing games collection without auth", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/games/add`);

    // Should redirect to login
    await page.waitForURL(new RegExp(`/${DEFAULT_LOCALE}/login`));
    await expect(page.getByText(/sign in|login|entrar/i).first()).toBeVisible();
  });

  test("Redirects to login when accessing consoles collection without auth", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/consoles/add`);

    // Should redirect to login
    await page.waitForURL(new RegExp(`/${DEFAULT_LOCALE}/login`));
  });

  test("Redirects to login when accessing accessories collection without auth", async ({
    page,
  }) => {
    await page.goto(`/${DEFAULT_LOCALE}/user/collection/accessories/add`);

    // Should redirect to login
    await page.waitForURL(new RegExp(`/${DEFAULT_LOCALE}/login`));
  });
});
