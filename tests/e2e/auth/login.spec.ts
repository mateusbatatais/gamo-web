// tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

test("Login com Firebase", async ({ page }) => {
  const email = process.env.ADMIN_EMAIL || "";
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    if (process.env.CI) {
      throw new Error("Credenciais não configuradas no CI");
    } else {
      test.skip(true, "Credenciais não configuradas localmente");
      return;
    }
  }

  // Só faz mock em ambiente local
  if (!process.env.CI) {
    await page.route("**/firebase-auth-api", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "mock-jwt-token" }),
      });
    });
  }

  await page.goto("/login");

  // Preencher formulário
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Aguardar condições de sucesso
  await Promise.race([
    page.waitForURL(/\/account/),
    page.waitForSelector("text=Login successful", { timeout: 10000 }),
  ]);

  // Verificar localStorage - mais tolerante
  const storageState = await page.evaluate(() => localStorage.getItem("gamo_token"));

  // Verificação mais robusta
  if (process.env.CI) {
    expect(storageState).toBeTruthy();
  } else {
    expect(storageState).toEqual("mock-jwt-token");
  }

  // Verificar URL
  const url = page.url();
  expect(url).toMatch(/\/account/);
});
