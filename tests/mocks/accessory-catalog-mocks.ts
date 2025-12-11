import { Page } from "@playwright/test";

export const MOCK_ACCESSORIES = {
  items: [
    {
      id: 1,
      name: "DualSense Wireless Controller",
      slug: "dualsense-controller",
      imageUrl: "",
      consoleId: 1, // PS5
      type: "controller",
      releaseDate: "2020-11-12",
      isFavorite: false,
    },
    {
      id: 2,
      name: "Xbox Wireless Controller",
      slug: "xbox-wireless-controller",
      imageUrl: "",
      consoleId: 2, // Xbox Series X
      type: "controller",
      releaseDate: "2020-11-10",
      isFavorite: true,
    },
    {
      id: 3,
      name: "PlayStation VR2",
      slug: "psvr2",
      imageUrl: "",
      consoleId: 1, // PS5
      type: "vr-headset",
      releaseDate: "2023-02-22",
      isFavorite: false,
    },
  ],
  meta: {
    total: 3,
    page: 1,
    perPage: 20,
    totalPages: 1,
  },
};

export const MOCK_ACCESSORY_TYPES = [
  { id: 1, name: "Controller", slug: "controller" },
  { id: 2, name: "VR Headset", slug: "vr-headset" },
  { id: 3, name: "Headset", slug: "headset" },
  { id: 4, name: "Charging Station", slug: "charging-station" },
];

export const MOCK_ACCESSORY_CONSOLES = [
  { id: 1, name: "PlayStation 5", slug: "ps5" },
  { id: 2, name: "Xbox Series X", slug: "xbox-series-x" },
  { id: 3, name: "Nintendo Switch", slug: "switch" },
];

export const MOCK_ACCESSORY_DETAIL = {
  id: 1,
  name: "DualSense Wireless Controller",
  slug: "dualsense-controller",
  description:
    "Experience haptic feedback and adaptive triggers with the DualSense wireless controller.",
  imageUrl: "",
  images: ["", ""],
  consoleId: 1,
  consoleName: "PlayStation 5",
  type: "controller",
  releaseDate: "2020-11-12",
  isFavorite: false,
  inCollection: false,
  features: ["Haptic Feedback", "Adaptive Triggers", "Built-in Microphone"],
};

export const mockAccessoryCatalogAPI = async (page: Page) => {
  // Mock Accessory Types Filter
  await page.route("**/api/accessories/types", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: MOCK_ACCESSORY_TYPES.length, results: MOCK_ACCESSORY_TYPES }),
    });
  });

  // Mock Compatible Consoles Filter
  await page.route("**/api/accessories/consoles", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        count: MOCK_ACCESSORY_CONSOLES.length,
        results: MOCK_ACCESSORY_CONSOLES,
      }),
    });
  });

  // Mock Accessories List
  await page.route(/\/api\/accessories(\?.*)?$/, async (route) => {
    const url = new URL(route.request().url());
    const pageParam = url.searchParams.get("page") || "1";
    const searchParam = url.searchParams.get("search");

    if (pageParam === "2") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [], meta: { ...MOCK_ACCESSORIES.meta, page: 2 } }),
      });
      return;
    }

    const responseBody = { ...MOCK_ACCESSORIES };
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

export const mockAccessoryDetailAPI = async (page: Page, slug: string) => {
  await page.route(`**/api/accessories/${slug}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_ACCESSORY_DETAIL),
    });
  });
};
