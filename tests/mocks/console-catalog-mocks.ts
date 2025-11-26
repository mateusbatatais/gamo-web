// tests/e2e/mocks/console-catalog-mocks.ts
import { Page, Route } from "@playwright/test";

export const mockConsolesAPI = async (page: Page) => {
  await page.route("**/api/consoles**", async (route: Route) => {
    const url = new URL(route.request().url());
    const searchParams = url.searchParams;

    const pageNum = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "12");

    const mockConsoles = Array.from({ length: perPage }, (_, i) => ({
      id: `console-${i + (pageNum - 1) * perPage}`,
      name: `Console ${i + 1}`,
      consoleName: `Console Model ${i + 1}`,
      brand: { slug: i % 2 === 0 ? "sony" : "microsoft" },
      imageUrl: `https://via.placeholder.com/150`,
      consoleDescription: `Description for console ${i + 1}`,
      slug: `console-${i + 1}`,
      isFavorite: false,
    }));

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: mockConsoles,
        meta: {
          totalPages: 3,
          currentPage: pageNum,
          perPage: perPage,
          totalItems: 36,
        },
      }),
    });
  });
};

export const mockEmptyConsolesAPI = async (page: Page) => {
  await page.route("**/api/consoles**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [],
        meta: {
          totalPages: 0,
          currentPage: 1,
          perPage: 12,
          totalItems: 0,
        },
      }),
    });
  });
};

export const mockBrandsAPI = async (page: Page) => {
  await page.route("**/api/brands**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { slug: "sony", name: "Sony" },
        { slug: "microsoft", name: "Microsoft" },
        { slug: "nintendo", name: "Nintendo" },
        { slug: "sega", name: "Sega" },
        { slug: "atari", name: "Atari" },
      ]),
    });
  });
};

export const mockGenerationsAPI = async (page: Page) => {
  await page.route("**/api/generations**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { slug: "ps4", name: "PlayStation 4" },
        { slug: "ps5", name: "PlayStation 5" },
        { slug: "xbox-one", name: "Xbox One" },
        { slug: "xbox-series", name: "Xbox Series" },
        { slug: "switch", name: "Nintendo Switch" },
      ]),
    });
  });
};

export const mockModelsAPI = async (page: Page) => {
  await page.route("**/api/models**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { slug: "ps4-slim", name: "PS4 Slim" },
        { slug: "ps4-pro", name: "PS4 Pro" },
        { slug: "ps5-digital", name: "PS5 Digital Edition" },
        { slug: "ps5-standard", name: "PS5 Standard" },
        { slug: "xbox-one-s", name: "Xbox One S" },
        { slug: "xbox-series-s", name: "Xbox Series S" },
        { slug: "xbox-series-x", name: "Xbox Series X" },
      ]),
    });
  });
};

export const mockMediaFormatsAPI = async (page: Page) => {
  await page.route("**/api/media-formats**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { slug: "disc", name: "Disc" },
        { slug: "digital", name: "Digital" },
        { slug: "cartridge", name: "Cartridge" },
      ]),
    });
  });
};
