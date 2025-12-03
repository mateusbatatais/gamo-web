import { MetadataRoute } from "next";
import { PaginatedResponse, Game, ConsoleVariant, Accessory } from "@/@types/catalog.types";
import { PublicUserProfile } from "@/@types/auth.types";

import { fetchApiServer } from "@/lib/api-server";

const BASE_URL = "https://gamo.games";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "pt"];
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

  // Fetch data
  const [games, consoles, accessories, users] = await Promise.all([
    fetchApiServer<PaginatedResponse<Game>>("/games?perPage=100").catch(() => ({ items: [] })),
    fetchApiServer<PaginatedResponse<ConsoleVariant>>("/consoles?perPage=100").catch(() => ({
      items: [],
    })),
    fetchApiServer<PaginatedResponse<Accessory>>("/accessories?perPage=100").catch(() => ({
      items: [],
    })),
    fetchApiServer<PaginatedResponse<PublicUserProfile>>("/users?perPage=100").catch(() => ({
      items: [],
    })),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Helper to add entries
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

  // Static routes
  addEntries(staticRoutes, "", 0.8, "daily");

  // Dynamic routes
  addEntries(games.items || [], "game", 0.7);
  addEntries(consoles.items || [], "console", 0.7);
  addEntries(accessories.items || [], "accessory", 0.7);
  addEntries(users.items || [], "user", 0.6);

  return sitemapEntries;
}
