import { Page } from "@playwright/test";

export const MOCK_GAMES = {
  items: [
    {
      id: 1,
      name: "The Legend of Zelda: Breath of the Wild",
      slug: "zelda-botw",
      imageUrl: "", // empty to avoid next/image config crash
      platforms: [1], // Switch
      parentPlatforms: [1],
      releaseDate: "2017-03-03",
      metacritic: 97,
      developer: "Nintendo",
      shortScreenshots: [],
      isFavorite: false,
      genres: [1, 2], // Action, Adventure
    },
    {
      id: 2,
      name: "God of War Ragnarök",
      slug: "gow-ragnarok",
      imageUrl: "",
      platforms: [2, 3], // PS5, PS4
      parentPlatforms: [2],
      releaseDate: "2022-11-09",
      metacritic: 94,
      developer: "Santa Monica Studio",
      shortScreenshots: [],
      isFavorite: true,
      genres: [1], // Action
    },
  ],
  meta: {
    total: 2,
    page: 1,
    perPage: 20,
    totalPages: 1,
  },
};

export const MOCK_GENRES = [
  { id: 1, name: "Action", slug: "action" },
  { id: 2, name: "Adventure", slug: "adventure" },
  { id: 3, name: "RPG", slug: "rpg" },
];

// Correct Structure: Parent Platform -> Child Platforms
export const MOCK_PLATFORMS = [
  {
    id: 1,
    name: "Nintendo",
    slug: "nintendo",
    platforms: [{ id: 1, name: "Nintendo Switch", slug: "switch" }],
  },
  {
    id: 2,
    name: "PlayStation",
    slug: "playstation",
    platforms: [
      { id: 2, name: "PlayStation 5", slug: "ps5" },
      { id: 3, name: "PlayStation 4", slug: "ps4" },
    ],
  },
];

export const mockGameCatalogAPI = async (page: Page) => {
  // Mock Filters - Must be defined BEFORE the generic games mock or use specific regex to avoid overlap
  await page.route("**/api/games/genres", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: MOCK_GENRES.length, results: MOCK_GENRES }),
    });
  });

  await page.route("**/api/games/platforms", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: MOCK_PLATFORMS.length, results: MOCK_PLATFORMS }),
    });
  });

  // Mock Games List - Use Regex to match /api/games AND /api/games?param but NOT /api/games/something
  await page.route(/\/api\/games(\?.*)?$/, async (route) => {
    const url = new URL(route.request().url());
    const pageParam = url.searchParams.get("page") || "1";
    const searchParam = url.searchParams.get("search");

    // return empty if page 2 (for pagination test)
    if (pageParam === "2") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [], meta: { ...MOCK_GAMES.meta, page: 2 } }),
      });
      return;
    }

    // basic search filtering mock
    const responseBody = { ...MOCK_GAMES };
    // Simulate empty search if specific term used
    if (searchParam && searchParam.includes("empty")) {
      responseBody.items = [];
      responseBody.meta.total = 0;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(responseBody),
    });
  });
};
