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
