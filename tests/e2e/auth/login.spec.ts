// tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

test("Login com Firebase", async ({ page }) => {
  // Carregar variáveis de ambiente com fallback seguro
  const email = process.env.ADMIN_EMAIL || "";
  const password = process.env.ADMIN_PASSWORD || "";

  // Verificar se as credenciais estão presentes
  if (!email || !password) {
    if (process.env.CI) {
      throw new Error("Credenciais não configuradas no CI");
    } else {
      test.skip(true, "Credenciais não configuradas localmente");
      return;
    }
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

  // Preencher formulário com verificação
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForLoadState("networkidle");

  // Verificar localStorage
  const storageState = await page.evaluate(() => localStorage.getItem("gamo_token"));
  expect(storageState).toBeTruthy();

  const url = page.url();
  expect(url).toMatch(/\/account/);
});
