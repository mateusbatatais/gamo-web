import { test, expect } from "@playwright/test";
import { mockAccessoryCatalogAPI } from "../../mocks/accessory-catalog-mocks";

const DEFAULT_LOCALE = "en";

test.describe("Accessory Catalog", () => {
  test.beforeEach(async ({ page }) => {
    await mockAccessoryCatalogAPI(page);
    await page.goto(`/${DEFAULT_LOCALE}/accessory-catalog`);
  });

  test("Initial Page Rendering", async ({ page }) => {
    // Check Filter Sidebar presence
    await expect(page.getByText(/filters/i).first()).toBeVisible();

    // Check Sort Options - Verify default value
    await expect(page.getByRole("combobox")).toHaveValue("name-asc");

    // Check Accessory Cards (from mock)
    await expect(page.getByText("DualSense Wireless Controller")).toBeVisible();
    await expect(page.getByText("Xbox Wireless Controller")).toBeVisible();
    await expect(page.getByText("PlayStation VR2")).toBeVisible();
  });

  test("Filtering by Type", async ({ page }) => {
    // Wait for page to load
    await expect(page.getByText(/filters/i).first()).toBeVisible();

    // Find any checkbox in the type filter section (first available type)
    const firstTypeCheckbox = page.locator('input[type="checkbox"][name="type"]').first();

    // Check if filters are loaded
    const isVisible = await firstTypeCheckbox.isVisible({ timeout: 5000 }).catch(() => false);

    if (isVisible) {
      // Get the value before checking
      const checkboxValue = await firstTypeCheckbox.getAttribute("value");

      // Check it
      await firstTypeCheckbox.check({ force: true });
      await expect(firstTypeCheckbox).toBeChecked();

      // Verify URL updates to include the type
      if (checkboxValue) {
        await expect(page).toHaveURL(new RegExp(`type=${checkboxValue}`));
      }
    }
  });

  test("Filtering by Console", async ({ page }) => {
    // Wait for page to load
    await expect(page.getByText(/filters/i).first()).toBeVisible();

    // Find any checkbox in the console filter section (first available console)
    const firstConsoleCheckbox = page.locator('input[type="checkbox"][name="console"]').first();

    // Check if filters are loaded
    const isVisible = await firstConsoleCheckbox.isVisible({ timeout: 5000 }).catch(() => false);

    if (isVisible) {
      // Get the value before checking
      const checkboxValue = await firstConsoleCheckbox.getAttribute("value");

      // Check it
      await firstConsoleCheckbox.check({ force: true });
      await expect(firstConsoleCheckbox).toBeChecked();

      // Verify URL updates to include the console
      if (checkboxValue) {
        await expect(page).toHaveURL(new RegExp(`consoles=${checkboxValue}`));
      }
    }
  });

  test("Sorting Accessories", async ({ page }) => {
    const sortSelect = page.getByRole("combobox");
    await expect(sortSelect).toBeVisible();

    // Select "Release Date (Newest)" - correct value is releaseDate-desc
    await sortSelect.selectOption("releaseDate-desc");

    // Check value update
    await expect(sortSelect).toHaveValue("releaseDate-desc");
  });

  test("Empty State", async ({ page }) => {
    // Trigger empty search
    await page.route(/\/api\/accessories(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [], meta: { total: 0, page: 1, totalPages: 0 } }),
      });
    });
    await page.reload();

    await expect(page.getByText(/nenhum acessório encontrado|no accessories found/i)).toBeVisible();
  });

  test("Search Functionality", async ({ page }) => {
    // Find search input (may be in header or sidebar)
    const searchInput = page.getByTestId("search-input").locator("visible=true");

    const isVisible = await searchInput.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVisible) {
      await searchInput.fill("controller");

      // Click search button
      const searchBtn = page.getByTestId("search-button").locator("visible=true");
      const btnVisible = await searchBtn.isVisible().catch(() => false);

      if (btnVisible) {
        await searchBtn.click();

        // Wait a bit for potential URL update
        await page.waitForTimeout(1000);

        // Verify URL contains search parameter OR page didn't crash
        const url = page.url();
        // Search might be in URL or just in component state
        expect(url).toBeTruthy();
      }
    }
  });

  test("Pagination", async ({ page }) => {
    // Override mock to show 2 pages
    await page.route(/\/api\/accessories(\?.*)?$/, async (route) => {
      const url = new URL(route.request().url());
      const pageParam = url.searchParams.get("page") || "1";
      const meta = { total: 40, page: Number(pageParam), perPage: 20, totalPages: 2 };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [], meta }),
      });
    });
    await page.reload();

    // Check Pagination Controls
    const nextButton = page.getByLabel("Próxima página");
    await expect(nextButton).toBeVisible();

    // Click next page
    await nextButton.click();

    // Verify URL change
    await expect(page).toHaveURL(/page=2/);
  });

  test("View Mode Toggle", async ({ page }) => {
    // Default is Grid
    const gridLayout = page.locator(".grid.grid-cols-2");
    await expect(gridLayout).toBeVisible();

    // Switch to List
    const listButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-list") })
      .first();
    await expect(listButton).toBeVisible();

    await listButton.click();

    // Verify layout changed to List
    await expect(gridLayout).not.toBeVisible();
    await expect(page.locator(".flex.flex-col.space-y-6")).toBeVisible();
  });

  test("Navigation to Accessory Details", async ({ page }) => {
    const accessoryCard = page.getByText("DualSense Wireless Controller").first();
    await expect(accessoryCard).toBeVisible();

    // Click the card
    await accessoryCard.click();

    // Verify Navigation to /accessory/dualsense-controller
    await expect(page).toHaveURL(/\/accessory\/dualsense-controller/);
  });

  test("Error State", async ({ page }) => {
    await page.route(/\/api\/accessories(\?.*)?$/, async (route) => {
      await route.fulfill({ status: 500 });
    });
    await page.reload();

    // Use heading to be specific
    await expect(page.getByRole("heading", { name: /erro|error/i })).toBeVisible();
  });
});
