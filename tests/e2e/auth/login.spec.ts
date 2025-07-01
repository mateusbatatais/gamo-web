// tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

test("Login com Firebase", async ({ page }) => {
  // Verifica credenciais
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    test.fail(true, "Credenciais não configuradas no ambiente");
    return;
  }

  // Mock mais robusto
  await page.route("**/firebase-auth-api", (route) => {
    console.log("Interceptando chamada Firebase API");
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "mock-jwt-token" }),
    });
  });

  // Monitorar console e erros
  page.on("console", (msg) => console.log("CONSOLE:", msg.text()));
  page.on("pageerror", (error) => console.error("PAGE ERROR:", error.message));

  await page.goto("/login", { waitUntil: "networkidle" });

  // Debug: tirar screenshot antes do preenchimento
  await page.screenshot({ path: "screenshot-before-login.png" });

  // Preencher formulário com verificações
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await page.fill('input[name="email"]', adminEmail);

  await expect(page.locator('input[name="password"]')).toBeVisible();
  await page.fill('input[name="password"]', adminPassword);

  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  await page.click('button[type="submit"]');

  // Esperar específicamente pelo token
  await page.waitForFunction(
    () => {
      return localStorage.getItem("gamo_token") !== null;
    },
    { timeout: 10000 },
  );

  // Verificar localStorage
  const storageState = await page.evaluate(() => localStorage.getItem("gamo_token"));
  console.log("Token no localStorage:", storageState);

  if (!storageState) {
    await page.screenshot({ path: "screenshot-after-login-failed.png" });
    test.fail(true, "Token não encontrado no localStorage");
    return;
  }

  expect(storageState).toBeTruthy();

  // Verificar redirecionamento
  await page.waitForURL(/\/account/, { timeout: 5000 });
  const url = page.url();
  console.log("URL atual:", url);

  if (!url.match(/\/account/)) {
    await page.screenshot({ path: "screenshot-after-redirect-failed.png" });
  }

  expect(url).toMatch(/\/account/);

  // Debug: tirar screenshot após login bem-sucedido
  await page.screenshot({ path: "screenshot-after-login.png" });
});
