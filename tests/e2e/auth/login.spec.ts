// tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

// Configuração do locale padrão para testes
const DEFAULT_LOCALE = "en";

test("Login com Firebase", async ({ page, context }) => {
  // Mock da rota correta considerando locale
  await page.route(`**/api/auth/login`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "mock-jwt-token" }),
    });
  });

  // Acessar login com locale padrão
  await page.goto(`/${DEFAULT_LOCALE}/login`);

  // Preencher formulário
  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL!);
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);

  // Disparar submit
  await page.click('button[type="submit"]');

  // Esperar redirecionamento específico com locale
  await page.waitForURL(`**/${DEFAULT_LOCALE}/account`);

  // Verificar localStorage usando o contexto do Playwright
  const storage = await context.storageState();
  const token = storage.origins[0].localStorage.find((item) => item.name === "gamo_token")?.value;

  expect(token).toBeTruthy();
  expect(token).toBe("mock-jwt-token");
});
