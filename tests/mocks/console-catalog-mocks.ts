// tests/e2e/mocks/console-catalog-mocks.ts
import { Page, Route } from "@playwright/test";

// Simplified mock type for testing (independent from real types to avoid conflicts)
type MockConsole = {
  id: string;
  name: string;
  slug: string;
  brand: { slug: string; name: string };
  generation: { slug: string; name: string };
  type: string;
  price: number;
  imageUrl: string;
  releaseDate: string;
  consoleName: string;
  isFavorite: boolean;
};

const ALL_CONSOLES: MockConsole[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `console-${i}`,
  name: i % 2 === 0 ? `PlayStation ${5 - (i % 5)}` : `Xbox Series ${i % 2 === 0 ? "X" : "S"}`,
  slug: `console-${i}`,
  brand: {
    slug: i % 2 === 0 ? "sony" : "microsoft",
    name: i % 2 === 0 ? "Sony" : "Microsoft",
  },
  generation: {
    slug: i % 2 === 0 ? "9" : "8",
    name: i % 2 === 0 ? "Generation 9" : "Generation 8",
  },
  type: "Home Console",
  price: 299.99 + i * 10, // Vary prices for sorting tests
  imageUrl: "/images/logo-gamo.svg",
  releaseDate: "2020-11-12",
  consoleName:
    i % 2 === 0 ? `PlayStation ${5 - (i % 5)}` : `Xbox Series ${i % 2 === 0 ? "X" : "S"}`,
  isFavorite: false,
}));

export const mockConsolesAPI = async (page: Page) => {
  // Use predicate function to match ONLY /api/consoles (not /api/consoles/models, etc.)
  await page.route(
    (url) => {
      return url.pathname === "/api/consoles" || url.pathname.endsWith("/api/consoles");
    },
    async (route: Route) => {
      const requestUrl = route.request().url();
      console.log(`[MOCK] Intercepted request: ${requestUrl}`);

      const url = new URL(route.request().url());
      const searchParams = url.searchParams;

      const pageNum = parseInt(searchParams.get("page") || "1");
      const perPage = parseInt(searchParams.get("perPage") || "12");
      const search = searchParams.get("search")?.toLowerCase();
      const brand = searchParams.get("brand");
      const generation = searchParams.get("generation");
      const sort = searchParams.get("sort");

      let filtered = [...ALL_CONSOLES];

      if (search) {
        filtered = filtered.filter((c) => c.consoleName.toLowerCase().includes(search));
      }

      if (brand) {
        const brands = brand.split(",");
        filtered = filtered.filter((c) => brands.includes(c.brand.slug));
      }

      if (generation) {
        const generations = generation.split(",");
        // Simple mock match
        filtered = filtered.filter((c) => generations.includes(c.generation.slug));
      }

      // Sorting logic (support both underscore and hyphen formats)
      if (sort === "price_asc" || sort === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === "price_desc" || sort === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === "name_asc" || sort === "name-asc") {
        filtered.sort((a, b) => a.consoleName.localeCompare(b.consoleName));
      } else if (sort === "name_desc" || sort === "name-desc") {
        filtered.sort((a, b) => b.consoleName.localeCompare(a.consoleName));
      }

      const start = (pageNum - 1) * perPage;
      const end = start + perPage;
      const items = filtered.slice(start, end);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          items: items,
          meta: {
            totalPages: Math.ceil(filtered.length / perPage),
            currentPage: pageNum,
            perPage: perPage,
            totalItems: filtered.length,
          },
        }),
      });
    },
  );
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
      ]),
    });
  });
};

export const mockModelsAPI = async (page: Page) => {
  await page.route("**/api/consoles/models", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });
};

export const mockMediaFormatsAPI = async (page: Page) => {
  await page.route("**/api/consoles/media-formats/list", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });
};

export const mockGenerationsAPI = async (page: Page) => {
  await page.route("**/api/consoles/generations", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "ps4", slug: "ps4", name: "PlayStation 4" },
        { id: "ps5", slug: "ps5", name: "PlayStation 5" },
      ]),
    });
  });
};
