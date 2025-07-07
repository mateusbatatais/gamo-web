import { test, expect } from "@playwright/test";
const DEFAULT_LOCALE = "en";

test.describe("Atualização de Perfil", () => {
  test.use({ storageState: "tests/e2e/storageState.json" });

  test("Atualiza campos do perfil (nome, slug e descrição)", async ({ page }) => {
    await page.goto("/en/account/details");
    await page.waitForTimeout(6000);

    const novoNome = "Nome Teste";
    const novoSlug = "slug-teste";
    const novaDescricao = "Descrição de teste";

    await page.fill('[data-testid="input-name"]', novoNome);
    await page.fill('[data-testid="input-slug"]', novoSlug);
    await page.fill('[data-testid="input-textarea-description"]', novaDescricao);

    await page.click('[data-testid="button-save"]');

    await expect(page.getByRole("alert").getByText(/Details updated successfully!/i)).toBeVisible();

    // Força nova navegação para simular persistência real
    await page.goto("/en/account/details");

    await expect(page.locator('[data-testid="input-name"]')).toHaveValue(novoNome);
    await expect(page.locator('[data-testid="input-slug"]')).toHaveValue(novoSlug);
    await expect(page.locator('[data-testid="input-textarea-description"]')).toHaveValue(
      novaDescricao,
    );
  });

  // test("Realiza upload e crop de nova imagem de perfil", async ({ page }) => {
  //   await page.goto("/en/account/details");

  //   const [fileChooser] = await Promise.all([
  //     page.waitForEvent("filechooser"),
  //     page.click('[data-testid="button-select-photo"]'),
  //   ]);

  //   await fileChooser.setFiles({
  //     name: "avatar.jpg",
  //     mimeType: "image/jpeg",
  //     buffer: Buffer.from(
  //       "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  //       "base64",
  //     ),
  //   });

  //   await page.waitForSelector("[data-testid='image-cropper']");
  //   await page.click("[data-testid='button-crop-confirm']");
  //   await page.click("[data-testid='button-save']");

  //   await expect(page.getByRole("alert").getByText(/perfil atualizado com sucesso/i)).toBeVisible();
  // });
});

test.describe("Acesso não autenticado", () => {
  test.use({ storageState: undefined });

  test("Redireciona ou bloqueia acesso à página de detalhes sem autenticação", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/account/details`);

    // Verificar se foi redirecionado para login
    await page.waitForURL(`**/${DEFAULT_LOCALE}/login`);
    await expect(page.getByText(/Sign in to continue/i)).toBeVisible();
  });
});
