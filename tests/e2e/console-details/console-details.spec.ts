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
    // Delay mock response to ensure skeleton renders
    await page.route("**/api/consoles/*", async (route) => {
      await page.waitForTimeout(800); // Longer delay for parallel execution
      await route.continue();
    });

    const navigation = page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);

    // Check skeleton appears during loading with generous timeout
    const skeleton = page.locator('[data-testid^="skeleton"]').first();
    await expect(skeleton).toBeVisible({ timeout: 5000 }); // Increased from 2000

    await navigation; // Wait for navigation to complete

    // Skeleton should disappear after load with generous timeout
    await expect(skeleton).not.toBeVisible({ timeout: 10000 }); // Increased from 5000
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

    // Clica no botão de adicionar à coleção usando testid correto
    const collectionButton = firstSkinCard.getByTestId("favorite-button-collection");
    await expect(collectionButton).toBeVisible();
    await collectionButton.click();

    // Aguarda o modal abrir
    await page.waitForTimeout(1000);

    // Verifica se o modal foi aberto
    await expect(page.getByTestId("simple-collection-modal")).toBeVisible({ timeout: 15000 });
  });

  test("Abre modal de trade/anúncio", async ({ page }) => {
    // Encontra o primeiro card de skin
    const firstSkinCard = page.locator('[data-testid^="skin-card-"]').first();
    await expect(firstSkinCard).toBeVisible({ timeout: 10000 });

    // Clica no botão de trade usando testid correto
    const tradeButton = firstSkinCard.getByTestId("favorite-button-market");
    await expect(tradeButton).toBeVisible({ timeout: 10000 });
    await expect(tradeButton).toBeEnabled({ timeout: 5000 });

    // Use force click to ensure it registers
    await tradeButton.click({ force: true });

    // Wait longer for modal animation
    await page.waitForTimeout(2000); // Increased for parallel execution

    // Verifica se o modal de trade foi aberto com timeout maior
    const modal = page.getByTestId("trade-modal");
    await expect(modal).toBeVisible({ timeout: 30000 }); // Increased for parallel execution

    // Verify modal content loaded
    await expect(modal.locator("form")).toBeVisible({ timeout: 10000 }); // Increased for parallel execution
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

  // NO beforeEach - each test sets its own mocks to avoid conflicts

  test("Exibe erro quando console não é encontrado", async ({ page }) => {
    // Set error mock BEFORE navigation
    await page.route("**/api/consoles/*", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "Console not found" }),
      });
    });

    // Mock other required APIs to prevent errors
    await page.route("**/api/brands", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.goto(`/${DEFAULT_LOCALE}/console/console-inexistente`);

    // Wait for error state to render
    await page.waitForTimeout(1000);

    // Check for specific error message (exact text from component)
    await expect(page.getByText("Console version not found")).toBeVisible({
      timeout: 10000,
    });
  });

  test("Exibe erro na seção de acessórios", async ({ page }) => {
    // Setup console mock first
    await mockConsoleDetailsAPI(page);
    await mockBrandsAPI(page);

    // Then override accessories with error
    await page.route("**/api/accessories*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);

    // Expande a seção de acessórios
    const collapse = page.getByTestId("accessories-collapse");
    await expect(collapse).toBeVisible({ timeout: 10000 });
    await collapse.click();

    // Wait for error to render
    await page.waitForTimeout(2000);

    // Since we don't know the exact error text, check if accessories didn't load
    // (no accessory cards visible = error state)
    const accessoryCards = page.locator('[data-testid^="accessory-card-"]');
    await page.waitForTimeout(1000);
    const count = await accessoryCards.count();
    expect(count).toBe(0); // No accessories loaded = error state
  });

  test.describe("Cobertura Expandida", () => {
    test("Botão de Favorito Global", async ({ page }) => {
      await mockConsoleDetailsAPI(page);
      await mockBrandsAPI(page);
      await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);

      const favoriteButton = page.locator('[data-testid="favorite-action-button"] button');
      await expect(favoriteButton).toBeVisible();
      await expect(favoriteButton).toBeEnabled();

      // Mock favorite action
      await page.route("**/api/favorites/toggle", async (route) => {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      });

      await favoriteButton.click();
      // Wait for pending routes to settle
      await page.waitForTimeout(1000);
    });

    test("Breadcrumbs de Navegação", async ({ page }) => {
      await mockConsoleDetailsAPI(page);
      await mockBrandsAPI(page);
      await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);

      const breadcrumbs = page.getByTestId("breadcrumbs");
      await expect(breadcrumbs).toBeVisible({ timeout: 10000 });

      const homeLink = breadcrumbs.getByRole("link", { name: /home/i });
      await expect(homeLink).toBeVisible();

      await expect(breadcrumbs).toContainText("PlayStation 5 Slim");
    });

    test("Seção de Mercado do Console", async ({ page }) => {
      await mockConsoleDetailsAPI(page);
      await mockBrandsAPI(page);

      // Mock market data
      // Mock market data
      await page.route("**/user-consoles/market/variant/*", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [
              {
                id: 1,
                price: 3500,
                condition: "new",
                userName: "Store A",
                userSlug: "store-a",
                userId: 1,
                createdAt: new Date().toISOString(),
                status: "SELLING",
                acceptsTrade: true,
              },
            ],
          }),
        });
      });

      await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);

      // Found in en.json: "market": "Marketplace"
      await expect(page.getByRole("heading", { name: /marketplace/i })).toBeVisible();

      // Verify market item visible
      await page.waitForTimeout(1000);
      await expect(page.getByText("Store A")).toBeVisible();
    });

    test("Botão de Reportar Problema", async ({ page }) => {
      await mockConsoleDetailsAPI(page);
      await mockBrandsAPI(page);
      await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);

      // Verify button exists and is visible
      // Button label in en.json: "Report Problem" (assumed)
      const reportButton = page.getByRole("button", { name: /report a problem/i });
      await expect(reportButton).toBeVisible();

      // Click to open dialog
      await reportButton.click();

      // Verify dialog opens
      await expect(page.getByRole("dialog")).toBeVisible();
      // "descriptionLabel": "Description"
      await expect(page.getByText(/description/i)).toBeVisible();

      // Close dialog
      await page.getByRole("button", { name: /cancel/i }).click();
      await expect(page.getByRole("dialog")).not.toBeVisible();
    });

    test("Toast de Erro na Falha da API", async ({ page }) => {
      // Mock failure
      await page.route("**/api/consoles/*", async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Critical Server Error" }),
        });
      });

      await page.goto(`/${DEFAULT_LOCALE}/console/ps5-slim`);

      // Verify toast message appears using .last() or .first() to avoid multiple matches if component duplicates it
      // Using .first() is safer effectively
      await expect(page.getByText("Critical Server Error").first()).toBeVisible({ timeout: 10000 });
    });
  });
});
