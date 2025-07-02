// tests/e2e/auth/recover.spec.ts
import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";

test("Fluxo de recuperação de senha", async ({ page }) => {
  // Mock da rota de recuperação
  await page.route("**/api/auth/recover", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  // Acessar página de recuperação
  await page.goto(`/${DEFAULT_LOCALE}/recover`);

  // Preencher email
  await page.fill('input[name="email"]', "usuario@example.com");

  // Submeter formulário
  await page.click('button[type="submit"]');

  // Verificar exibição de mensagem de sucesso
  await expect(page.getByText(/Email sent!/)).toBeVisible();
});
