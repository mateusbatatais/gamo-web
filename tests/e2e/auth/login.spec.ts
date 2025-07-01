// tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

declare const process: {
  env: {
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
  };
};

test("Login com Firebase", async ({ page }) => {
  // Mock da resposta da API
  await page.route("**/firebase-auth-api", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "mock-jwt-token" }),
    });
  });

  await page.goto("/login");

  // Preencher formulário
  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);

  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);

  await page.click('button[type="submit"]');

  await page.waitForLoadState("networkidle");

  // Verificar localStorage
  const storageState = await page.evaluate(() => localStorage.getItem("gamo_token"));
  expect(storageState).toBeTruthy();

  const url = page.url();
  expect(url).toMatch(/\/account/);
});
