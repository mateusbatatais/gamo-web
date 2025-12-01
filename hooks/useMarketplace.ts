// hooks/useMarketplace.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { MarketplaceItem, PaginatedResponse } from "@/@types/catalog.types";

interface UseMarketplaceOptions {
  page: number;
  perPage: number;
  sort?: string;
  searchQuery?: string;
  // General filters
  itemType?: string[];
  status?: string;
  condition?: string[];
  priceMin?: string;
  priceMax?: string;
  hasBox?: boolean;
  hasManual?: boolean;
  acceptsTrade?: boolean;
  // Game filters
  platforms?: number[];
  genres?: number[];
  media?: string[];
  // Console filters
  brands?: string[];
  generations?: string[];
  consoleModels?: string[];
  consoleTypes?: string[];
  mediaFormats?: string[];
  storageRanges?: string[];
  allDigital?: boolean;
  retroCompatible?: boolean;
  // Accessory filters
  accessoryTypes?: string[];
  accessorySubTypes?: string[];
  accessoryConsoles?: string[];
}

export function useMarketplace({
  page,
  perPage,
  sort = "recent",
  searchQuery = "",
  // General filters
  itemType = [],
  status,
  condition = [],
  priceMin,
  priceMax,
  hasBox,
  hasManual,
  acceptsTrade,
  // Game filters
  platforms = [],
  genres = [],
  media = [],
  // Console filters
  brands = [],
  generations = [],
  consoleModels = [],
  consoleTypes = [],
  mediaFormats = [],
  storageRanges = [],
  allDigital,
  retroCompatible,
  // Accessory filters
  accessoryTypes = [],
  accessorySubTypes = [],
  accessoryConsoles = [],
}: UseMarketplaceOptions) {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<PaginatedResponse<MarketplaceItem>, Error>({
    queryKey: [
      "marketplace",
      page,
      perPage,
      sort,
      searchQuery,
      itemType.join(","),
      status || "",
      condition.join(","),
      priceMin || "",
      priceMax || "",
      hasBox,
      hasManual,
      acceptsTrade,
      platforms.join(","),
      genres.join(","),
      media.join(","),
      brands.join(","),
      generations.join(","),
      consoleModels.join(","),
      consoleTypes.join(","),
      mediaFormats.join(","),
      storageRanges.join(","),
      allDigital,
      retroCompatible,
      accessoryTypes.join(","),
      accessorySubTypes.join(","),
      accessoryConsoles.join(","),
    ],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");

      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        sort,
      });

      // General filters
      if (searchQuery) params.append("search", searchQuery);
      if (itemType.length > 0) params.append("itemType", itemType.join(","));
      if (status) params.append("status", status);
      if (condition.length > 0) params.append("condition", condition.join(","));
      if (priceMin) params.append("priceMin", priceMin);
      if (priceMax) params.append("priceMax", priceMax);
      if (hasBox) params.append("hasBox", "true");
      if (hasManual) params.append("hasManual", "true");
      if (acceptsTrade) params.append("acceptsTrade", "true");

      // Game filters
      if (platforms.length > 0) params.append("platforms", platforms.join(","));
      if (genres.length > 0) params.append("genres", genres.join(","));
      if (media.length === 1) params.append("media", media[0]);

      // Console filters
      if (brands.length > 0) params.append("brands", brands.join(","));
      if (generations.length > 0) params.append("generations", generations.join(","));
      if (consoleModels.length > 0) params.append("consoleModels", consoleModels.join(","));
      if (consoleTypes.length > 0) params.append("consoleTypes", consoleTypes.join(","));
      if (mediaFormats.length > 0) params.append("mediaFormats", mediaFormats.join(","));
      if (storageRanges.length > 0) params.append("storage", storageRanges.join(","));
      if (allDigital) params.append("allDigital", "true");
      if (retroCompatible) params.append("retroCompatible", "true");

      // Accessory filters
      if (accessoryTypes.length > 0) params.append("accessoryTypes", accessoryTypes.join(","));
      if (accessorySubTypes.length > 0)
        params.append("accessorySubTypes", accessorySubTypes.join(","));
      if (accessoryConsoles.length > 0)
        params.append("accessoryConsoles", accessoryConsoles.join(","));

      return await apiFetch(`/market?${params.toString()}`);
    },
    enabled: initialized,
    staleTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: (previousData) => previousData,
  });
}
