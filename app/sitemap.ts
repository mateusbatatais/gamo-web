import { MetadataRoute } from "next";
import { PaginatedResponse, Game, ConsoleVariant, Accessory } from "@/@types/catalog.types";
import { PublicUserProfile } from "@/@types/auth.types";

import { fetchApiServer } from "@/lib/api-server";

const BASE_URL = "https://gamo.games";
const ITEMS_PER_SITEMAP = 100; // Conservative limit to avoid timeouts

export async function generateSitemaps() {
  // Fetch counts to calculate number of sitemaps
  // Using perPage=1 to get metadata with minimal payload
  try {
    const [gamesMeta, consolesMeta, accessoriesMeta, usersMeta] = await Promise.all([
      fetchApiServer<PaginatedResponse<Game>>("/games?perPage=1")
        .then((r) => r.meta)
        .catch(() => ({ total: 0 })),
      fetchApiServer<PaginatedResponse<ConsoleVariant>>("/consoles?perPage=1")
        .then((r) => r.meta)
        .catch(() => ({ total: 0 })),
      fetchApiServer<PaginatedResponse<Accessory>>("/accessories?perPage=1")
        .then((r) => r.meta)
        .catch(() => ({ total: 0 })),
      fetchApiServer<PaginatedResponse<PublicUserProfile>>("/users?perPage=1")
        .then((r) => r.meta)
        .catch(() => ({ total: 0 })),
    ]);

    const sitemaps = [];

    // Static routes sitemap
    sitemaps.push({ id: "static" });

    // Games
    const gamesCount = Math.ceil((gamesMeta.total || 0) / ITEMS_PER_SITEMAP);
    for (let i = 0; i < gamesCount; i++) {
      sitemaps.push({ id: `games-${i}` });
    }

    // Consoles
    const consolesCount = Math.ceil((consolesMeta.total || 0) / ITEMS_PER_SITEMAP);
    for (let i = 0; i < consolesCount; i++) {
      sitemaps.push({ id: `consoles-${i}` });
    }

    // Accessories
    const accessoriesCount = Math.ceil((accessoriesMeta.total || 0) / ITEMS_PER_SITEMAP);
    for (let i = 0; i < accessoriesCount; i++) {
      sitemaps.push({ id: `accessories-${i}` });
    }

    // Users
    const usersCount = Math.ceil((usersMeta.total || 0) / ITEMS_PER_SITEMAP);
    for (let i = 0; i < usersCount; i++) {
      sitemaps.push({ id: `users-${i}` });
    }

    return sitemaps;
  } catch (error) {
    console.error("Error generating sitemaps:", error);
    return [{ id: "static" }];
  }
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "pt"];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  const addEntries = (
    items: (string | { slug: string })[],
    routePrefix: string,
    priority: number,
    changeFrequency: "daily" | "weekly" = "weekly",
  ) => {
    for (const item of items) {
      for (const locale of locales) {
        // Handle static routes (string items) vs dynamic items (objects with slug)
        const slug = typeof item === "string" ? item : item.slug;
        const url =
          typeof item === "string"
            ? `${BASE_URL}/${locale}${slug}`
            : `${BASE_URL}/${locale}/${routePrefix}/${slug}`;

        sitemapEntries.push({
          url,
          lastModified: new Date(),
          changeFrequency,
          priority: typeof item === "string" && item === "" ? 1 : priority,
        });
      }
    }
  };

  if (id === "static") {
    const staticRoutes = [
      "",
      "/about",
      "/contact",
      "/terms",
      "/privacy",
      "/game-catalog",
      "/console-catalog",
      "/accessory-catalog",
      "/marketplace",
    ];
    // Static routes
    addEntries(staticRoutes, "", 0.8, "daily");
  } else {
    const [type, indexStr] = id.split("-");
    const page = parseInt(indexStr) + 1;

    try {
      if (type === "games") {
        const res = await fetchApiServer<PaginatedResponse<Game>>(
          `/games?page=${page}&perPage=${ITEMS_PER_SITEMAP}`,
        );
        addEntries(res.items || [], "game", 0.7);
      } else if (type === "consoles") {
        const res = await fetchApiServer<PaginatedResponse<ConsoleVariant>>(
          `/consoles?page=${page}&perPage=${ITEMS_PER_SITEMAP}`,
        );
        addEntries(res.items || [], "console", 0.7);
      } else if (type === "accessories") {
        const res = await fetchApiServer<PaginatedResponse<Accessory>>(
          `/accessories?page=${page}&perPage=${ITEMS_PER_SITEMAP}`,
        );
        addEntries(res.items || [], "accessory", 0.7);
      } else if (type === "users") {
        const res = await fetchApiServer<PaginatedResponse<PublicUserProfile>>(
          `/users?page=${page}&perPage=${ITEMS_PER_SITEMAP}`,
        );
        addEntries(res.items || [], "user", 0.6);
      }
    } catch (error) {
      console.error(`Error generating sitemap for ${id}:`, error);
    }
  }

  return sitemapEntries;
}
