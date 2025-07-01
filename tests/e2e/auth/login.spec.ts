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

  console.log("Navegando para /login");
  await page.goto("/login");
  console.log("Página de login carregada");

  // Preencher formulário
  console.log(`Preenchendo formulário com email: ${email}`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  console.log("Clicando no botão de submit");
  await page.click('button[type="submit"]');

  // Verificar se houve erro de login
  const errorVisible = await page.isVisible("text=Erro de autenticação");
  if (errorVisible) {
    const errorText = await page.textContent(".error-message");
    throw new Error(`Erro de login: ${errorText}`);
  }

  // Aguardar qualquer indicação de sucesso
  console.log("Aguardando sinal de sucesso...");
  await Promise.race([
    page.waitForURL(/\/account/, { timeout: 60000 }),
    page.waitForSelector("text=Login realizado com sucesso", { timeout: 60000 }),
    page.waitForResponse(
      (response) => response.url().includes("firebase") && response.status() === 200,
      { timeout: 60000 },
    ),
    page.waitForFunction(
      () => {
        return localStorage.getItem("gamo_token") !== null;
      },
      { timeout: 60000 },
    ),
  ]).catch(async (error) => {
    console.error("Falha durante a espera por sucesso:");
    console.error(error);

    // Capturar estado atual para diagnóstico
    console.log("URL atual:", page.url());
    console.log("LocalStorage:", await page.evaluate(() => JSON.stringify(localStorage)));
    console.log("Cookies:", await page.context().cookies());

    throw error;
  });

  console.log("Sinal de sucesso detectado");

  // Verificar localStorage com fallback
  let storageState = await page.evaluate(() => localStorage.getItem("gamo_token"));

  if (!storageState) {
    console.log("Token não encontrado no localStorage, tentando novamente...");
    await page.waitForFunction(
      () => {
        return localStorage.getItem("gamo_token") !== null;
      },
      { timeout: 10000 },
    );
    storageState = await page.evaluate(() => localStorage.getItem("gamo_token"));
  }

  // Verificação mais tolerante
  if (process.env.CI) {
    expect(storageState).toBeTruthy();
    console.log("Token encontrado:", storageState?.substring(0, 20) + "...");
  } else {
    expect(storageState).toEqual("mock-jwt-token");
  }

  // Verificar URL
  const url = page.url();
  console.log("URL final:", url);
  expect(url).toMatch(/\/account/);
});
