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

  // Mock apenas em ambiente de desenvolvimento local
  if (process.env.NODE_ENV === "development") {
    console.log("Aplicando mock de autenticação");
    await page.route("**/api/auth/login", async (route) => {
      console.log("Interceptando chamada de login");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "mock-jwt-token" }),
      });
    });
  }

  await page.goto("/login");
  console.log("Página de login carregada");

  // Preencher formulário
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  console.log("Formulário submetido");

  // Aguardar redirecionamento
  await page.waitForURL(/\/account/, { timeout: 60000 });
  console.log("Redirecionamento para /account detectado");

  // Verificar localStorage
  const storageState = await page.evaluate(() => localStorage.getItem("gamo_token"));

  // Verificação condicional
  if (process.env.CI) {
    expect(storageState).toBeTruthy();
    console.log("Token JWT encontrado no CI");
  } else if (process.env.NODE_ENV === "development") {
    expect(storageState).toEqual("mock-jwt-token");
    console.log("Token mockado verificado");
  } else {
    expect(storageState).toMatch(/^eyJ/); // Verifica se é JWT
    console.log("Token real verificado");
  }

  // Verificar URL
  expect(page.url()).toMatch(/\/account/);
});
