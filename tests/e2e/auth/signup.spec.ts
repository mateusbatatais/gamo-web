// tests/e2e/auth/signup.spec.ts
import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";

test("Fluxo completo de cadastro", async ({ page }) => {
  // Mock das rotas de autenticação
  await page.route("**/api/auth/signup", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ userId: "123", code: "USER_CREATED" }),
    });
  });

  await page.route("**/api/auth/resend-verification", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  // Acessar página de cadastro
  await page.goto(`/${DEFAULT_LOCALE}/signup`);

  // Preencher formulário
  await page.fill('input[name="name"]', "Novo Usuário");
  await page.fill('input[name="email"]', "novo.usuario@example.com");
  await page.fill('input[name="password"]', "SenhaSegura123!");

  // Submeter formulário
  await page.click('button[type="submit"]');

  // Verificar redirecionamento para página de sucesso
  await page.waitForURL(`**/${DEFAULT_LOCALE}/signup/success?email=*`);

  // Verificar exibição do email na página de sucesso
  await expect(page.getByText("novo.usuario@example.com")).toBeVisible();

  // Testar reenvio de email de verificação

  await page.waitForTimeout(30000);
  await page.click('button:has-text("Resend confirmation email")');
  await expect(page.getByTestId("resend-success-message")).toBeVisible();
});
