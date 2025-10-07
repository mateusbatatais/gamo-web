// tests/e2e/console-details/console-details.spec.ts
import { test, expect } from "@playwright/test";
import {
  mockConsoleDetailsAPI,
  mockAccessoriesAPI,
  mockBrandsAPI,
} from "../../mocks/console-details-mocks";

const DEFAULT_LOCALE = "en";

test.describe("Detalhes do Console", () => {
  test.use({ storageState: "tests/e2e/storageState.json" });

  test.beforeEach(async ({ page }) => {
    // Configurar mocks antes de cada teste
    await mockConsoleDetailsAPI(page);
    await mockAccessoriesAPI(page);
    await mockBrandsAPI(page);

    await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);
  });

  test("Carrega a página de detalhes do console", async ({ page }) => {
    // Verifica se a página carrega corretamente
    await expect(page).toHaveURL(new RegExp(`/${DEFAULT_LOCALE}/console/ps5-slim`));

    // Verifica se os elementos principais estão presentes
    await expect(page.getByTestId("console-info")).toBeVisible();
    await expect(page.getByTestId("favorite-action-button")).toBeVisible();

    // Verifica se o nome do console está visível
    const heading = page.getByRole("heading", { name: /PlayStation 5/i }).first();
    await expect(heading).toBeVisible();
  });

  test("Exibe skeletons durante o carregamento", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);
    const skeleton = page.locator('[data-testid^="skeleton"]').first();
    await expect(skeleton).toBeVisible();
    await expect(skeleton).not.toBeVisible({ timeout: 10000 });
  });

  test("Exibe lista de skins disponíveis", async ({ page }) => {
    // Verifica se a seção de skins está presente
    await expect(page.getByRole("heading", { name: /available skins/i })).toBeVisible();

    // Verifica se os cards de skins são exibidos
    const skinCards = page.locator('[data-testid^="skin-card-"]');
    await expect(skinCards.first()).toBeVisible();

    // Verifica se há pelo menos um skin
    const skinCount = await skinCards.count();
    expect(skinCount).toBeGreaterThan(0);
  });

  test("Abre modal de adicionar à coleção", async ({ page }) => {
    // Encontra o primeiro card de skin
    const firstSkinCard = page.locator('[data-testid^="skin-card-"]').first();
    await expect(firstSkinCard).toBeVisible();

    // Encontra os botões de ação dentro do card
    const actionButtons = firstSkinCard.locator('[data-testid="collection-action-buttons"]');
    await expect(actionButtons).toBeVisible();

    // Clica no botão de adicionar à coleção (primeiro botão)
    const collectionButton = actionButtons.locator("button").first();
    await collectionButton.click();

    // Verifica se o modal foi aberto
    await expect(page.getByTestId("simple-collection-modal")).toBeVisible();
    await expect(page.getByRole("heading", { name: /adicionar à coleção/i })).toBeVisible();
  });

  test("Abre modal de trade/anúncio", async ({ page }) => {
    // Encontra o primeiro card de skin
    const firstSkinCard = page.locator('[data-testid^="skin-card-"]').first();

    // Encontra os botões de ação
    const actionButtons = firstSkinCard.locator('[data-testid="collection-action-buttons"]');

    // Clica no botão de trade (segundo botão)
    const tradeButton = actionButtons.locator("button").nth(1);
    await tradeButton.click();

    // Verifica se o modal de trade foi aberto
    await expect(page.getByTestId("trade-modal")).toBeVisible();
    await expect(page.getByRole("heading", { name: /anunciar console/i })).toBeVisible();
  });

  test.describe("Redireciona para login sem autenticação", () => {
    test.use({ storageState: undefined });

    test("Redireciona para login ao tentar adicionar sem autenticação", async ({ page }) => {
      await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);

      // Tenta clicar no botão de adicionar à coleção
      const firstSkinCard = page.locator('[data-testid^="skin-card-"]').first();
      const actionButtons = firstSkinCard.locator('[data-testid="collection-action-buttons"]');
      const collectionButton = actionButtons.locator("button").first();

      await collectionButton.click();

      // Verifica se foi redirecionado para login
      await page.waitForURL(`**/${DEFAULT_LOCALE}/login**`);
      await expect(page.getByText(/sign in to continue/i)).toBeVisible();
    });
  });

  test("Exibe e expande seção de acessórios", async ({ page }) => {
    // Verifica se o collapse de acessórios está presente
    const accessoriesCollapse = page.getByTestId("accessories-collapse");
    await expect(accessoriesCollapse).toBeVisible();

    // Expande a seção
    await accessoriesCollapse.click();

    // Aguarda o carregamento dos acessórios
    await page.waitForTimeout(1000);

    // Verifica se os acessórios são carregados
    const accessoryCards = page.locator('[data-testid^="accessory-card-"]');

    // Pode ter acessórios ou não, mas a seção deve funcionar
    const cardCount = await accessoryCards.count();
    if (cardCount > 0) {
      await expect(accessoryCards.first()).toBeVisible();
    }
  });

  test("Exibe estado vazio quando não há skins", async ({ page }) => {
    // Mock para console sem skins
    await page.route("**/api/consoles/*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          consoleName: "PlayStation 5",
          name: "Standard",
          brand: { id: 1, slug: "sony" },
          skins: [], // Sem skins
          storageOptions: [],
          mediaFormats: [],
          allDigital: false,
          retroCompatible: false,
          notes: [],
          isFavorite: false,
          consoleId: 1,
        }),
      });
    });

    await page.reload();

    // Verifica se a mensagem de nenhum skin disponível é exibida
    await expect(page.getByText(/no skins available/i)).toBeVisible();
  });

  test("Exibe informações técnicas do console", async ({ page }) => {
    // Verifica se a seção principal está presente
    await expect(page.getByTestId("console-details-content")).toBeVisible();

    // Verifica o título do console
    await expect(page.getByTestId("console-title")).toContainText("PlayStation 5");

    // Verifica badges
    await expect(page.getByTestId("console-badges")).toBeVisible();
    await expect(page.getByTestId("digital-badge")).toBeVisible();
    await expect(page.getByTestId("retro-badge")).toBeVisible();

    // Verifica seção de especificações
    await expect(page.getByTestId("specifications-section")).toBeVisible();

    // Verifica especificações individuais pelos valores
    await expect(page.getByTestId("cpu-spec")).toContainText("AMD Zen 2");
    await expect(page.getByTestId("gpu-spec")).toContainText("AMD RDNA 2");
    await expect(page.getByTestId("ram-spec")).toContainText("16GB");
    await expect(page.getByTestId("resolution-spec")).toContainText("4K");
    await expect(page.getByTestId("audio-spec")).toContainText("Tempest");
    await expect(page.getByTestId("connectivity-spec")).toContainText("Wi-Fi 6");

    // Verifica armazenamento e mídia
    await expect(page.getByTestId("storage-media-section")).toBeVisible();
    await expect(page.getByTestId("storage-spec")).toContainText("825 GB");
    await expect(page.getByTestId("media-formats-spec")).toContainText("Ultra HD Blu-ray");

    // Verifica datas de lançamento
    await expect(page.getByTestId("release-dates-section")).toBeVisible();
    await expect(page.getByTestId("release-dates-content")).toContainText("2020");

    // Verifica curiosidades
    await expect(page.getByTestId("fun-facts-section")).toBeVisible();
    await expect(page.getByTestId("fun-facts-list")).toBeVisible();
    await expect(page.getByTestId("fun-fact-1")).toContainText("8K");
  });
});

test.describe("Detalhes do Console - Estados de Erro", () => {
  test.use({ storageState: "tests/e2e/storageState.json" });

  test("Exibe erro quando console não é encontrado", async ({ page }) => {
    // Mock para console não encontrado
    await page.route("**/api/consoles/*", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "Console not found" }),
      });
    });

    await page.goto(`/${DEFAULT_LOCALE}/console/console-inexistente`);

    // Verifica se a mensagem de erro é exibida
    await expect(page.getByText(/not found/i)).toBeVisible();
  });

  test("Exibe erro na seção de acessórios", async ({ page }) => {
    // Mock para erro nos acessórios
    await page.route("**/api/accessories*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);

    // Expande a seção de acessórios
    await page.getByTestId("accessories-collapse").click();

    // Verifica se a mensagem de erro é exibida
    await expect(page.getByText(/failed to load accessories/i)).toBeVisible();
  });
});
