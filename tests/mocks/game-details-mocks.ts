import { Page } from "@playwright/test";

export const MOCK_GAME_DETAIL = {
  id: 1,
  name: "The Legend of Zelda: Breath of the Wild",
  slug: "zelda-botw",
  description:
    "Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild.",
  imageUrl: "",
  backgroundImage: "",
  screenshots: ["", "", ""],
  platforms: [1], // Switch
  platformNames: ["Nintendo Switch"],
  parentPlatforms: [1],
  releaseDate: "2017-03-03",
  metacritic: 97,
  score: 97,
  developer: "Nintendo",
  publisher: "Nintendo",
  genres: [
    { id: 1, name: "Action", slug: "action" },
    { id: 2, name: "Adventure", slug: "adventure" },
  ],
  tags: ["Open World", "RPG", "Exploration"],
  esrbRating: "E10+",
  isFavorite: false,
  inCollection: false,
  stats: {
    totalOwners: 1250,
    totalPlaying: 45,
    totalCompleted: 890,
  },
};

export const MOCK_RELATED_GAMES = {
  items: [
    {
      id: 2,
      name: "The Legend of Zelda: Tears of the Kingdom",
      slug: "zelda-totk",
      imageUrl: "",
      metacritic: 96,
    },
    {
      id: 3,
      name: "Super Mario Odyssey",
      slug: "mario-odyssey",
      imageUrl: "",
      metacritic: 97,
    },
  ],
};

export const mockGameDetailAPI = async (page: Page, slug: string) => {
  // Mock game details
  await page.route(`**/api/games/${slug}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_GAME_DETAIL),
    });
  });

  // Mock related games
  await page.route(`**/api/games/${slug}/related`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_RELATED_GAMES),
    });
  });

  // Mock game stats
  await page.route(`**/api/games/${slug}/stats`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_GAME_DETAIL.stats),
    });
  });
};
