import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";
const ACCESSORY_SLUG = "ps5-dualsense-controller"; // Use a real accessory slug from your database

test.describe("Accessory Details", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/accessory/${ACCESSORY_SLUG}`);
  });

  test("Page Renders with Accessory Information", async ({ page }) => {
    // Check accessory name is visible (h1)
    await expect(page.locator("h1")).toBeVisible();

    // Check that the page loaded successfully
    await expect(page.locator("h1")).not.toContainText(/not found|não encontrado/i);
  });

  test("Image Display", async ({ page }) => {
    // Check main image or placeholder is visible
    const imageContainer = page.locator(".aspect-square").first();
    await expect(imageContainer).toBeVisible();
  });

  test("Accessory Type Display", async ({ page }) => {
    // Check type badge using testid
    const typeBadge = page.getByTestId("accessory-type");
    await expect(typeBadge).toBeVisible();

    const typeText = await typeBadge.textContent();
    expect(typeText).toBeTruthy();
  });

  test("Description Display", async ({ page }) => {
    // Check description section (conditional)
    const description = page.getByTestId("accessory-description");

    const isVisible = await description.isVisible().catch(() => false);
    if (isVisible) {
      const descText = await description.textContent();
      expect(descText).toBeTruthy();
    }
  });

  test("Release Date Display", async ({ page }) => {
    // Check release date using testid
    const releaseDate = page.getByTestId("release-date");
    await expect(releaseDate).toBeVisible();
  });

  test("Compatible Consoles Display", async ({ page }) => {
    // Check compatible consoles section (conditional)
    const consolesSection = page.getByTestId("compatible-consoles");

    const isVisible = await consolesSection.isVisible().catch(() => false);
    if (isVisible) {
      // Verify section has content (text or badges)
      const sectionText = await consolesSection.textContent();
      expect(sectionText).toBeTruthy();
    }
  });

  test("Favorite Toggle", async ({ page }) => {
    // Find favorite button using testid
    const favoriteButton = page.getByTestId("favorite-action-button");

    const isVisible = await favoriteButton.isVisible().catch(() => false);
    if (isVisible) {
      await expect(favoriteButton).toBeEnabled();
    }
  });

  test("Variants Section Display", async ({ page }) => {
    // Check for variants section
    await expect(page.getByText(/available variants|variantes disponíveis/i)).toBeVisible();
  });

  test("Navigation Back to Catalog", async ({ page }) => {
    // Find breadcrumb or back link to catalog
    const catalogLink = page.getByRole("link", { name: /catalog|catálogo/i }).first();
    await expect(catalogLink).toBeVisible();
    await catalogLink.click();

    // Verify navigation to catalog
    await expect(page).toHaveURL(/\/accessory-catalog/);
  });

  test("404 Error for Non-existent Accessory", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/accessory/non-existent-accessory-12345`);

    // Verify 404 or not found message (use first() to avoid strict mode)
    await expect(page.getByText(/not found|não encontrado/i).first()).toBeVisible();
  });
});
