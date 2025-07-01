// tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

test("Login com Firebase", async ({ page }) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    test.fail(true, "Credenciais não configuradas no ambiente");
    return;
  }

  // Mock da resposta da API
  await page.route("**/firebase-auth-api", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "mock-jwt-token" }),
    });
  });

  await page.goto("/login");

  await page.fill('input[name="email"]', adminEmail);
  await page.fill('input[name="password"]', adminPassword);
  await page.click('button[type="submit"]');

  await page.waitForLoadState("networkidle");

  const storageState = await page.evaluate(() => localStorage.getItem("gamo_token"));
  expect(storageState).toBeTruthy();

  const url = page.url();
  expect(url).toMatch(/\/account/);
});
