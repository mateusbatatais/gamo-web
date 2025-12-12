import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
let GAME_SLUG: string;

test.describe("Game Details", () => {
  test.beforeAll(async ({ request }) => {
    // Fetch a real game from the API to use in tests
    const response = await request.get(
      `${API_URL}/api/games?locale=${DEFAULT_LOCALE}&page=1&perPage=1`,
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      GAME_SLUG = data.items[0].slug;
    } else {
      throw new Error("No games found in API for testing");
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/game/${GAME_SLUG}`);
  });

  test("Page Renders with Game Information", async ({ page }) => {
    // Check game name is visible (h1)
    await expect(page.locator("h1")).toBeVisible();

    // Check that the page loaded successfully (not 404)
    await expect(page.locator("h1")).not.toContainText(/not found|não encontrado/i);
  });

  test("Game Score Display", async ({ page }) => {
    // Check Metacritic score using testid (conditional - InfoItem may not have testid)
    const metacriticScore = page.getByTestId("metacritic-score");

    const isVisible = await metacriticScore.isVisible().catch(() => false);
    if (isVisible) {
      const scoreText = await metacriticScore.textContent();
      expect(scoreText).toBeTruthy();
    } else {
      // Fallback: check if any score is visible (use first() to avoid strict mode)
      await expect(page.getByText(/metacritic|rating/i).first()).toBeVisible();
    }
  });

  test("Platform Information Display", async ({ page }) => {
    // Check platforms list exists
    const platformList = page.getByTestId("platform-list");
    await expect(platformList).toBeVisible();

    // Verify at least one platform badge is shown
    const platformBadges = platformList.locator('[data-testid^="platform-"]');
    await expect(platformBadges.first()).toBeVisible();
  });

  test("Release Date Display", async ({ page }) => {
    // Check release date is visible (InfoItem component)
    await expect(page.getByText(/release date|data de lançamento/i)).toBeVisible();
  });

  test("Screenshots Gallery", async ({ page }) => {
    // Check if screenshots section exists (conditional)
    const screenshotsSection = page.getByTestId("screenshots-gallery");

    const isVisible = await screenshotsSection.isVisible().catch(() => false);
    if (isVisible) {
      // Verify at least one screenshot image
      const images = screenshotsSection.locator("img");
      await expect(images.first()).toBeVisible();
    }
  });

  test("Add to Collection Button", async ({ page }) => {
    // Find add to collection button (should be visible)
    const addButton = page.getByRole("button", { name: /add|adicionar/i }).first();
    await expect(addButton).toBeVisible();

    // Button should be clickable
    await expect(addButton).toBeEnabled();
  });

  test("Favorite Toggle", async ({ page }) => {
    // Find favorite button (heart icon button)
    const favoriteButton = page
      .locator('button[aria-label*="favorite"], button[aria-label*="favorito"]')
      .first();

    const isVisible = await favoriteButton.isVisible().catch(() => false);
    if (isVisible) {
      await expect(favoriteButton).toBeEnabled();
    }
  });

  test("Related Games Section", async ({ page }) => {
    // Check for related games section (conditional)
    const relatedSection = page.getByTestId("related-games-section");

    const isVisible = await relatedSection.isVisible().catch(() => false);
    if (isVisible) {
      // Verify badges are shown
      const badges = relatedSection.locator('[class*="Badge"]');
      await expect(badges.first()).toBeVisible();
    }
  });

  test("Navigation Back to Catalog", async ({ page }) => {
    // Find breadcrumb or back link to catalog
    const catalogLink = page.getByRole("link", { name: /catalog|catálogo/i }).first();
    await expect(catalogLink).toBeVisible();
    await catalogLink.click();

    // Verify navigation to catalog
    await expect(page).toHaveURL(/\/game-catalog/);
  });

  test("404 Error for Non-existent Game", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/game/non-existent-game-slug-12345`);

    // Verify game info section is NOT visible (indicates 404)
    const platformList = page.getByTestId("platform-list");
    await expect(platformList).not.toBeVisible();
  });

  test("ESRB Rating Display", async ({ page }) => {
    // Check ESRB rating badge (conditional)
    const esrbBadge = page.getByTestId("esrb-rating");

    const isVisible = await esrbBadge.isVisible().catch(() => false);
    if (isVisible) {
      const ratingText = await esrbBadge.textContent();
      expect(ratingText).toBeTruthy();
    }
  });
});
