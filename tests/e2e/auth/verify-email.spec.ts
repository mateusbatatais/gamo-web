// tests/e2e/auth/verify-email.spec.ts
import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";
const VALID_TOKEN = "valid-verification-token";
const INVALID_TOKEN = "invalid-verification-token";

test("Verificação de email bem-sucedida", async ({ page }) => {
  // Mock da rota de verificação
  await page.route(`**/api/auth/verify-email?token=${VALID_TOKEN}`, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  // Acessar página de verificação
  await page.goto(`/${DEFAULT_LOCALE}/verify-email?token=${VALID_TOKEN}`);

  // Verificar mensagem de sucesso
  await expect(page.getByTestId("verify-success-message")).toBeVisible();

  // Verificar redirecionamento automático para login
  await page.waitForURL(`**/${DEFAULT_LOCALE}/login`);
});

test("Verificação de email com token inválido", async ({ page }) => {
  // Mock da rota de verificação para token inválido
  await page.route(`**/api/auth/verify-email?token=${INVALID_TOKEN}`, (route) => {
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        code: "INVALID_OR_EXPIRED_TOKEN",
        message: "Invalid or expired token",
      }),
    });
  });

  // Acessar página de verificação
  await page.goto(`/${DEFAULT_LOCALE}/verify-email?token=${INVALID_TOKEN}`);

  // Verificar mensagem de erro
  await expect(page.getByText(/Link expired/)).toBeVisible();

  // Verificar botão para cadastro
  await expect(page.getByRole("button", { name: /Go to Sign Up/ })).toBeVisible();
});
