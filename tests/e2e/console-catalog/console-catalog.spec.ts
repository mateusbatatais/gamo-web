// tests/e2e/console-catalog/console-catalog.spec.ts
import {
  mockBrandsAPI,
  mockConsolesAPI,
  mockEmptyConsolesAPI,
  mockGenerationsAPI,
} from "@/tests/mocks/console-catalog-mocks";
import { test, expect, Route } from "@playwright/test";

const DEFAULT_LOCALE = "en";

test.describe("Catálogo de Consoles", () => {
  test.use({ storageState: "tests/e2e/storageState.json" });

  test.beforeEach(async ({ page }) => {
    // Configurar todos os mocks antes de cada teste
    await mockBrandsAPI(page);
    await mockGenerationsAPI(page);
    await mockConsolesAPI(page);

    await page.goto(`/${DEFAULT_LOCALE}/console-catalog`);
  });

  test("Carrega a página inicial do catálogo", async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(`/${DEFAULT_LOCALE}/console-catalog`));
    await expect(page.getByTestId("search-input")).toBeVisible();
    await expect(page.getByTestId("sort-select-container")).toBeVisible();
    await expect(page.getByTestId("button-grid-view")).toBeVisible();
    await expect(page.getByTestId("button-list-view")).toBeVisible();
    await expect(page.locator('[data-testid^="console-card"]').first()).toBeVisible();
  });

  test("Exibe skeletons durante o carregamento", async ({ page }) => {
    await page.goto(`/${DEFAULT_LOCALE}/console-catalog?page=2`);
    const skeleton = page.locator('[data-testid^="skeleton"]').first();
    await expect(skeleton).toBeVisible();
    await expect(skeleton).not.toBeVisible({ timeout: 10000 });
  });

  test("Busca por consoles", async ({ page }) => {
    const searchTerm = "PlayStation";

    await page.route("**/api/consoles**", async (route: Route) => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get("search");

      const mockConsoles =
        search === searchTerm
          ? [
              {
                id: "console-playstation",
                name: "PlayStation 5",
                consoleName: "PlayStation 5 Digital Edition",
                brand: { slug: "sony" },
                imageUrl: "https://via.placeholder.com/150",
                consoleDescription: "PlayStation 5 console",
                slug: "playstation-5",
                isFavorite: false,
              },
            ]
          : [];

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: mockConsoles,
          meta: {
            totalPages: mockConsoles.length > 0 ? 1 : 0,
            currentPage: 1,
            perPage: 12,
            totalItems: mockConsoles.length,
          },
        }),
      });
    });

    await page.fill('[data-testid="search-input"]', searchTerm);
    await page.click('[data-testid="search-button"]');

    // Verifica se a URL contém o parâmetro de busca, independente da ordem
    await page.waitForURL((url) => {
      return url.searchParams.get("search") === searchTerm;
    });

    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible();
  });

  test("Filtra por marca", async ({ page }) => {
    await page.route("**/api/consoles**", async (route: Route) => {
      const url = new URL(route.request().url());
      const brands = url.searchParams.get("brand");

      const mockConsoles =
        brands === "sony"
          ? [
              {
                id: "console-sony-1",
                name: "PlayStation 5",
                consoleName: "PlayStation 5",
                brand: { slug: "sony" },
                imageUrl: "https://via.placeholder.com/150",
                consoleDescription: "Sony console",
                slug: "playstation-5",
                isFavorite: false,
              },
            ]
          : [];

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: mockConsoles,
          meta: {
            totalPages: mockConsoles.length > 0 ? 1 : 0,
            currentPage: 1,
            perPage: 12,
            totalItems: mockConsoles.length,
          },
        }),
      });
    });

    // Aguarda o checkbox estar disponível
    await page.waitForSelector('[data-testid="checkbox-sony"]');
    await page.click('[data-testid="checkbox-sony"]');

    // Verifica se a URL contém brand=sony, independente da ordem dos parâmetros
    await page.waitForURL((url) => {
      return url.searchParams.get("brand") === "sony";
    });

    await expect(page.locator('[data-testid="checkbox-sony"]')).toBeChecked();

    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible();
  });

  test("Aplica múltiplos filtros", async ({ page }) => {
    await page.route("**/api/consoles**", async (route: Route) => {
      const url = new URL(route.request().url());
      const brands = url.searchParams.get("brand");
      const generations = url.searchParams.get("generation");

      const mockConsoles =
        brands === "sony" && generations === "ps5"
          ? [
              {
                id: "console-ps5",
                name: "PlayStation 5",
                consoleName: "PlayStation 5",
                brand: { slug: "sony" },
                imageUrl: "https://via.placeholder.com/150",
                consoleDescription: "PS5 console",
                slug: "playstation-5",
                isFavorite: false,
              },
            ]
          : [];

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: mockConsoles,
          meta: {
            totalPages: mockConsoles.length > 0 ? 1 : 0,
            currentPage: 1,
            perPage: 12,
            totalItems: mockConsoles.length,
          },
        }),
      });
    });

    await page.waitForSelector('[data-testid="checkbox-sony"]');
    await page.click('[data-testid="checkbox-sony"]');

    // Aguarda o primeiro filtro ser aplicado antes do segundo
    await page.waitForURL((url) => url.searchParams.get("brand") === "sony");
    await page.click('[data-testid="checkbox-9"]');

    // Verifica se ambos os parâmetros estão presentes na URL
    await page.waitForURL((url) => {
      return url.searchParams.get("brand") === "sony" && url.searchParams.get("generation") === "9";
    });

    await expect(page.locator('[data-testid="checkbox-sony"]')).toBeChecked();
  });

  test("Limpa todos os filtros", async ({ page }) => {
    // Aplica alguns filtros primeiro
    await page.waitForSelector('[data-testid="checkbox-sony"]');
    await page.click('[data-testid="checkbox-sony"]');

    // Aguarda o filtro ser aplicado
    await page.waitForURL((url) => url.searchParams.get("brand") === "sony");

    // Clica no botão limpar filtros
    await page.click('button:has-text("Limpar filtros")');

    // Verifica se a URL não contém mais os parâmetros de filtro
    await page.waitForURL((url) => {
      return (
        !url.searchParams.get("brand") &&
        !url.searchParams.get("generation") &&
        !url.searchParams.get("model") &&
        !url.searchParams.get("type")
      );
    });

    await expect(page.locator('[data-testid="checkbox-sony"]')).not.toBeChecked();
  });

  test("Ordena os resultados", async ({ page }) => {
    const sortOption = "name-asc";

    await page.route("**/api/consoles**", async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: [
            {
              id: "console-1",
              name: "Alpha Console",
              consoleName: "Alpha Console",
              brand: { slug: "sony" },
              imageUrl: "https://via.placeholder.com/150",
              consoleDescription: "Alpha console",
              slug: "alpha-console",
              isFavorite: false,
            },
          ],
          meta: {
            totalPages: 1,
            currentPage: 1,
            perPage: 12,
            totalItems: 1,
          },
        }),
      });
    });

    await page.selectOption('[data-testid="sort-select-container"] select', sortOption);

    // Verifica se a URL contém o parâmetro sort
    await page.waitForURL((url) => {
      return url.searchParams.get("sort") === sortOption;
    });

    await expect(page.locator('[data-testid="sort-select-container"] select')).toHaveValue(
      sortOption,
    );
  });

  test("Alterna entre visualização grid e lista", async ({ page }) => {
    await expect(page.locator(".grid.grid-cols-2")).toBeVisible();
    await page.click('[data-testid="button-list-view"]');
    await expect(page.locator(".flex-col.space-y-6")).toBeVisible();
    await page.click('[data-testid="button-grid-view"]');
    await expect(page.locator(".grid.grid-cols-2")).toBeVisible();
  });

  test("Navega entre páginas", async ({ page }) => {
    await page.waitForSelector('[data-testid="pagination-container"]');
    const nextButton = page.locator('button:has-text("Próxima")');
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Verifica se a página foi atualizada
    await page.waitForURL((url) => {
      return url.searchParams.get("page") === "2";
    });
  });

  test("Estado vazio sem resultados", async ({ page }) => {
    await mockEmptyConsolesAPI(page);
    await page.fill('[data-testid="search-input"]', "termo-que-nao-existe");
    await page.click('[data-testid="search-button"]');

    // Aguarda a busca ser processada
    await page.waitForTimeout(1000);

    await expect(page.getByTestId("empty-state-container")).toBeVisible();
    await expect(page.getByText("Nenhum console encontrado")).toBeVisible();
  });
});
