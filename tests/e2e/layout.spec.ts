// tests/e2e/layout.spec.ts
import { test, expect } from "@playwright/test";

test("Layout principal", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toContainText("GAMO");
});
