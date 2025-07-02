// tests/e2e/auth/reset-password.spec.ts
import { expect, test } from "@playwright/test";

const DEFAULT_LOCALE = "en";
const MOCK_TOKEN = "valid-reset-token-123";

test("Fluxo de reset de senha", async ({ page }) => {
  // Mock da rota de reset de senha
  await page.route("**/api/auth/reset-password", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  // Acessar página de reset com token
  await page.goto(`/${DEFAULT_LOCALE}/reset-password?token=${MOCK_TOKEN}`);

  // Preencher novas senhas
  await page.fill('input[name="newPassword"]', "NovaSenha123!");
  await page.fill('input[name="confirmPassword"]', "NovaSenha123!");

  // Submeter formulário
  await page.click('button[type="submit"]');

  // Verificar redirecionamento para login
  await expect(page.getByText(/Password reset!/)).toBeVisible();

  // Verificar mensagem de sucesso (assumindo que sua aplicação mostra uma toast)
  // Esta parte depende da implementação do seu ToastContext
});
