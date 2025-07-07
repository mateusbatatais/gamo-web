import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";

test.describe("Alteração de Senha", () => {
  test.use({ storageState: "tests/e2e/storageState.json" });

  test("Altera a senha com sucesso", async ({ page }) => {
    await page.route("**/api/user/profile/password", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto(`/${DEFAULT_LOCALE}/account/security`);

    await expect(page.locator('[data-testid="input-current-password"]')).toBeVisible();

    await page.fill('[data-testid="input-current-password"]', "fake-old-password");
    await page.fill('[data-testid="input-new-password"]', "senha-nova-123");
    await page.fill('[data-testid="input-confirm-password"]', "senha-nova-123");

    await page.click('[data-testid="button-change-password"]');

    await expect(
      page.getByRole("alert").getByText(/Password changed successfully!/i),
    ).toBeVisible();
  });

  test("Exibe erro quando senhas novas não coincidem", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/account/security`);

    await page.fill('[data-testid="input-current-password"]', "senha-antiga");
    await page.fill('[data-testid="input-new-password"]', "senha-nova-123");
    await page.fill('[data-testid="input-confirm-password"]', "senha-diferente");

    await page.click('[data-testid="button-change-password"]');

    await expect(page.getByRole("alert").getByText(/Passwords do not match./i)).toBeVisible();
  });

  test("Exibe erro genérico ao falhar na API", async ({ page }) => {
    await page.route("**/api/user/profile/password", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Erro ao atualizar senha" }),
      });
    });

    await page.goto(`/${DEFAULT_LOCALE}/account/security`);

    await page.fill('[data-testid="input-current-password"]', "senha-antiga");
    await page.fill('[data-testid="input-new-password"]', "senha-nova-123");
    await page.fill('[data-testid="input-confirm-password"]', "senha-nova-123");

    await page.click('[data-testid="button-change-password"]');

    await expect(page.getByRole("alert").getByText(/Erro ao atualizar senha/i)).toBeVisible();
  });
});
