// tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

// Configuração do locale padrão para testes
const DEFAULT_LOCALE = "en";

test("Login com Firebase", async ({ page }) => {
  await page.route(`**/api/auth/login`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "mock-jwt-token",
        user: {
          email: process.env.ADMIN_EMAIL,
          name: "Admin User",
        },
      }),
    });
  });

  await page.goto(`/${DEFAULT_LOCALE}/login`);
  await page.waitForSelector('input[name="email"]', { state: "visible", timeout: 15000 });

  // Preencher formulário com checks adicionais
  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await expect(page.locator('input[name="email"]')).toHaveValue(process.env.ADMIN_EMAIL!);

  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);
  await expect(page.locator('input[name="password"]')).toHaveValue(process.env.ADMIN_PASSWORD!);

  // Disparar submit com verificação
  await Promise.all([
    page.waitForResponse(
      (response) => response.url().includes("/api/auth/login") && response.status() === 200,
    ),
    page.click('button[type="submit"]'),
  ]);

  // Esperar redirecionamento com timeout maior
  await page.waitForURL(`**/${DEFAULT_LOCALE}/account`, { timeout: 30000 });

  // Verificações adicionais
  await expect(page).toHaveURL(`/${DEFAULT_LOCALE}/account`);
});
