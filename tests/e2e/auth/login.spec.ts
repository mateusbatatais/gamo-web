// tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

// Extende a interface Window para incluir 'firebase'
declare global {
  interface Window {
    firebase?: {
      auth: () => {
        signInWithEmailAndPassword: (
          email: string,
          password: string,
        ) => Promise<{
          user: {
            getIdToken: () => Promise<string>;
            email: string;
          };
        }>;
      };
    };
  }
}

test("Login com Firebase", async ({ page }) => {
  // Verifica credenciais
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    test.fail(true, "Credenciais não configuradas no ambiente");
    return;
  }

  // Configurar fallback para i18n
  await page.addInitScript(() => {
    window.localStorage.setItem("i18nextLng", "en");
  });

  // Mock completo do Firebase Auth
  await page.addInitScript(() => {
    // Usar window.firebase com verificação de segurança
    window.firebase = {
      auth: () => ({
        signInWithEmailAndPassword: (email: string) =>
          Promise.resolve({
            user: {
              getIdToken: () => Promise.resolve("mock-jwt-token"),
              email: email,
            },
          }),
      }),
    };
  });

  // Mock da rota API
  await page.route("**/firebase-auth-api", (route) => {
    console.log("✅ Mock da API Firebase acionado");
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "mock-jwt-token" }),
    });
  });

  // Monitorar eventos
  page.on("console", (msg) => console.log("CONSOLE:", msg.text()));
  page.on("pageerror", (error) => console.error("PAGE ERROR:", error.message));

  await page.goto("/login", { waitUntil: "networkidle" });

  // Preencher formulário
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

  expect(storageState).toBeTruthy();

  // Verificar redirecionamento
  await page.waitForURL(/\/account/, { timeout: 5000 });
  const url = page.url();
  console.log("URL atual:", url);

  expect(url).toMatch(/\/account/);
});
