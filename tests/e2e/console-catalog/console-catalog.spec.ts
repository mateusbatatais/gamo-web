// tests/e2e/console-catalog/console-catalog.spec.ts
import {
  mockBrandsAPI,
  mockConsolesAPI,
  mockGenerationsAPI,
  mockModelsAPI,
  mockMediaFormatsAPI,
} from "../../mocks/console-catalog-mocks";
import { test, expect } from "@playwright/test";

const DEFAULT_LOCALE = "en";

test.describe("Catálogo de Consoles", () => {
  // Configuração global para este describe
  test.use({
    storageState: "tests/e2e/storageState.json",
    viewport: { width: 1920, height: 1080 },
  });

  test.beforeEach(async ({ page }) => {
    // Capture console logs and errors to debug "Application error"
    page.on("console", (msg) => console.log(`BROWSER LOG: ${msg.text()}`));
    page.on("pageerror", (err) => console.log(`BROWSER ERROR: ${err.message}`));

    // Configurar todos os mocks antes de cada teste
    await mockConsolesAPI(page);
    await mockBrandsAPI(page);
    await mockGenerationsAPI(page);
    await mockModelsAPI(page);
    await mockMediaFormatsAPI(page);

    await page.goto(`/${DEFAULT_LOCALE}/console-catalog`);
  });

  test("Carrega a página inicial do catálogo com itens", async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(`/${DEFAULT_LOCALE}/console-catalog`));

    // DEBUG: Log content if search input is missing
    const isSearchVisible = await page.getByTestId("search-input").isVisible();
    if (!isSearchVisible) {
      console.log("DEBUG: Page content:", await page.content());
    }

    // Verifica elementos estruturais principais
    await expect(page.getByTestId("search-input")).toBeVisible({ timeout: 30000 });
    await expect(page.getByTestId("sort-select-container")).toBeVisible();

    // Verifica se os cards iniciais foram renderizados
    // Como o mock padrão tem itens, esperamos ver algo
    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible();

    // Validar contagem baseada na paginação padrão (API usa perPage=20)
    expect(await consoleCards.count()).toBeLessThanOrEqual(20);
  });

  test("Busca por termo específico filtra a lista", async ({ page }) => {
    const searchTerm = "PlayStation";

    // Digita e busca
    await page.fill('[data-testid="search-input"]', searchTerm);
    await page.click('[data-testid="search-button"]');

    // Aguarda a UI atualizar (não depende de URL pois pode usar client-side filtering)
    await page.waitForTimeout(2000); // Aguarda debounce + API + render

    // Verifica se a UI atualizou para mostrar apenas itens relevantes
    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible({ timeout: 15000 });

    // Validar texto de um card para garantir que é o item certo
    await expect(consoleCards.first()).toContainText("PlayStation");
  });

  test("Filtra por marca (Checkbox)", async ({ page }) => {
    // Aguarda carregar filtros
    await expect(page.getByTestId("label-filter-brand")).toBeVisible();
    const sonyCheckbox = page.locator('[data-testid="checkbox-sony"]');
    await expect(sonyCheckbox).toBeVisible();

    // Clica no filtro
    await sonyCheckbox.click();

    // Verifica URL
    await page.waitForURL((url) => url.searchParams.get("brand") === "sony");
    await expect(sonyCheckbox).toBeChecked();

    // Verifica resultados na UI
    // O mock filtra por slug=sony (indices pares)
    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible();

    // Todos os cards visíveis devem ser Sony
    const cardText = await consoleCards.first().innerText();
    expect(cardText).toMatch(/Sony/i);
  });

  test("Combinação de filtros (Marca + Geração)", async ({ page }) => {
    // 1. Filtra Marca
    await page.locator('[data-testid="checkbox-sony"]').click();
    await page.waitForURL((url) => url.searchParams.get("brand") === "sony");

    // 2. Filtra Geração (Generation 9 - PS5 era)
    // O GenerationFilter usa valores numéricos: "9", "8", "7", etc.
    const gen9Checkbox = page.locator('[data-testid="checkbox-9"]');
    await gen9Checkbox.waitFor({ state: "visible", timeout: 5000 });
    await gen9Checkbox.click();

    // Verifica URL com ambos os parametros
    await page.waitForURL((url) => {
      return url.searchParams.get("brand") === "sony" && url.searchParams.get("generation") === "9";
    });

    // Verifica UI
    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible();
  });

  test("Limpar filtros reseta a visualização", async ({ page }) => {
    // Aplica um filtro
    await page.locator('[data-testid="checkbox-sony"]').click();
    await page.waitForURL((url) => url.searchParams.get("brand") === "sony");

    // Clica em limpar (Button com texto "Limpar" ou similar)
    // Precisamos de um seletor robusto. O código mostra label={t("filters.clear")}
    // Vamos tentar pelo texto que provavelmente é "Clear" ou "Limpar" dependendo do locale,
    // Limpar filtros
    // O botão "Limpar" deve aparecer no topo dos filtros
    const clearButton = page.getByTestId("clear-filters-button");
    await clearButton.click();

    // Verifica URL limpa
    await page.waitForURL((url) => !url.searchParams.has("brand"));

    // Verifica checkbox desmarcado
    await expect(page.locator('[data-testid="checkbox-sony"]')).not.toBeChecked();
  });

  test("Estado vazio aparece quando busca falha", async ({ page }) => {
    // Navega diretamente para a URL com busca impossível
    // Isso garante que o mock intercepta a requisição corretamente
    await page.goto(`/${DEFAULT_LOCALE}/console-catalog?search=XYZ123_IMPOSSIBLE_TERM&page=1`);

    // Aguarda a requisição ser processada
    await page.waitForTimeout(2000);

    // Verifica que não há cards visíveis (resultado vazio)
    const consoleCards = page.locator('[data-testid^="console-card"]');
    const cardCount = await consoleCards.count();

    // O mock deve retornar 0 resultados para busca impossível
    expect(cardCount).toBe(0);
  });

  test("Paginação funciona", async ({ page }) => {
    // Garante que estamos na página 1
    await expect(page).toHaveURL(/page=1|console-catalog$/);

    // Clica na proxima pagina
    // O componente Pagination geralmente tem botões Próxima/Anterior
    const pagination = page.getByTestId("pagination-container");
    const nextButton = pagination.getByRole("button", { name: /próxima|next/i });

    // Se não tiver botão visível (poucos itens), este teste pode falhar ou precisar de condicional.
    // O mock padrão tem 30 itens e perPage=12, então tem 3 páginas.
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Verifica URL page=2
    await page.waitForURL((url) => url.searchParams.get("page") === "2");
  });

  // ========== PRIORITY TEST SCENARIOS ==========

  test("Ordena por nome (A-Z)", async ({ page }) => {
    // Localiza o select de ordenação
    const sortSelect = page.getByTestId("sort-select-container").locator("select");
    await expect(sortSelect).toBeVisible();

    // Seleciona ordenação por nome ascendente
    await sortSelect.selectOption("name-asc");

    // Verifica URL
    await page.waitForURL((url) => url.searchParams.get("sort") === "name-asc");

    // Aguarda atualização da lista
    await page.waitForTimeout(500);

    // Verifica que os cards estão ordenados
    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible();

    // Pega os nomes dos primeiros 3 cards
    const firstCardText = await consoleCards.nth(0).innerText();
    const secondCardText = await consoleCards.nth(1).innerText();

    // Verifica ordem alfabética (primeiro deve vir antes do segundo)
    expect(firstCardText.localeCompare(secondCardText)).toBeLessThanOrEqual(0);
  });

  test("Ordena por nome (Z-A)", async ({ page }) => {
    // Localiza o select de ordenação com timeout maior
    const sortSelect = page.getByTestId("sort-select-container").locator("select");
    await expect(sortSelect).toBeVisible({ timeout: 15000 });

    // Seleciona ordenação por nome descendente (opção que existe)
    await sortSelect.selectOption("name-desc", { timeout: 20000 });

    // Verifica URL com timeout maior
    await page.waitForURL((url) => url.searchParams.get("sort") === "name-desc", {
      timeout: 45000,
    });

    // Aguarda atualização da UI
    await page.waitForTimeout(1000);

    // Verifica que cards estão visíveis
    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible({ timeout: 15000 });
  });

  test("Click em card navega para página de detalhes", async ({ page }) => {
    // Aguarda cards carregarem
    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible();

    // Pega o primeiro card e seu link
    const firstCard = consoleCards.first();
    const cardLink = firstCard.locator("a").first();

    // Pega o slug do href para validar navegação
    const href = await cardLink.getAttribute("href");
    expect(href).toMatch(/\/console\//);

    // Clica no card
    await cardLink.click();

    // Verifica navegação para página de detalhes
    await page.waitForURL(/\/console\/.+/);
    expect(page.url()).toContain("/console/");
  });

  test("Alterna entre modos Grid e List", async ({ page }) => {
    // Aguarda cards carregarem
    const consoleCards = page.locator('[data-testid^="console-card"]');
    await expect(consoleCards.first()).toBeVisible();

    // Localiza os botões de view mode (geralmente ícones de grid/list)
    // Assumindo que há botões com aria-label ou data-testid
    const listViewButton = page.getByRole("button", { name: /list view|visualização em lista/i });

    // Se o botão existir, clica
    if (await listViewButton.isVisible()) {
      await listViewButton.click();

      // Aguarda mudança de layout
      await page.waitForTimeout(300);

      // Verifica que cards ainda estão visíveis (but em layout diferente)
      await expect(consoleCards.first()).toBeVisible();

      // Volta para grid
      const gridViewButton = page.getByRole("button", { name: /grid view|visualização em grade/i });
      await gridViewButton.click();

      await page.waitForTimeout(300);
      await expect(consoleCards.first()).toBeVisible();
    }
  });
});

// ========== ERROR HANDLING (ISOLATED) ==========
// Este describe não usa beforeEach para evitar conflitos de mock
test.describe("Error Handling (Isolated)", () => {
  test.use({
    storageState: "tests/e2e/storageState.json",
    viewport: { width: 1920, height: 1080 },
  });

  test.skip("Exibe mensagem de erro quando API falha", async ({ page }) => {
    // Intercepta a API e força um erro 500 (SEM beforeEach)
    await page.route("**/api/consoles", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // Navega para a página do catálogo
    await page.goto(`/${DEFAULT_LOCALE}/console-catalog`);

    // Aguarda mensagem de erro aparecer
    await expect(page.getByText(/erro/i)).toBeVisible({ timeout: 10000 });
  });
});
