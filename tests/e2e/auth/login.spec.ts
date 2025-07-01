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

  // Desativar mock em ambiente CI
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

  // Aguardar condições de sucesso com timeout maior
  await Promise.race([
    page.waitForURL(/\/account/, { timeout: 30000 }),
    page.waitForResponse(
      (response) => response.url().includes("firebase") && response.status() === 200,
      { timeout: 30000 },
    ),
  ]);

  // Verificar localStorage com fallback
  let storageState = null;
  let attempts = 0;

  while (!storageState && attempts < 5) {
    storageState = await page.evaluate(() => localStorage.getItem("gamo_token"));
    if (!storageState) {
      await page.waitForTimeout(1000); // Esperar 1 segundo
      attempts++;
    }
  }

  // Verificação mais tolerante
  if (process.env.CI) {
    // No CI, aceita qualquer token válido
    expect(storageState).toMatch(/^eyJ/); // Verifica se parece um JWT
  } else {
    expect(storageState).toEqual("mock-jwt-token");
  }

  // Verificar URL
  const url = page.url();
  expect(url).toMatch(/\/account/);
});
