// src/hooks/useConsoles.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { ConsoleVariant, PaginatedResponse } from "@/@types/catalog.types";

// src/hooks/useConsoles.ts
interface UseConsolesOptions {
  locale: string;
  page: number;
  perPage: number;
  sort?: string;
  selectedBrands?: string[];
  selectedGenerations?: string[];
  selectedModels?: string[];
  selectedTypes?: string[];
  selectedAllDigital?: boolean;
  searchQuery?: string;
  storageRanges?: string[];
  selectedMediaFormats?: string[];
  retroCompatible?: boolean;
}

export function useConsoles({
  locale,
  page,
  perPage,
  sort = "releaseDate-desc",
  selectedBrands = [],
  selectedGenerations = [],
  selectedModels = [],
  selectedTypes = [],
  selectedAllDigital = false,
  searchQuery = "",

  selectedMediaFormats = [],
  retroCompatible,
  storageRanges = [],
}: UseConsolesOptions) {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<PaginatedResponse<ConsoleVariant>, Error>({
    queryKey: [
      "consoles",
      locale,
      page,
      perPage,
      sort,
      selectedBrands.join(","),
      selectedGenerations.join(","),
      selectedModels.join(","),
      selectedTypes.join(","),
      selectedAllDigital,
      searchQuery,
      selectedMediaFormats.join(","),
      storageRanges.join(","),
      retroCompatible,
    ],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");

      const params = new URLSearchParams({
        locale,
        page: page.toString(),
        perPage: perPage.toString(),
      });

      if (sort) params.append("sort", sort);
      if (selectedBrands.length > 0) params.append("brand", selectedBrands.join(","));
      if (selectedGenerations.length > 0)
        params.append("generation", selectedGenerations.join(","));
      if (selectedModels.length > 0) params.append("model", selectedModels.join(","));
      if (selectedTypes.length > 0) params.append("type", selectedTypes.join(","));
      if (selectedAllDigital) params.append("allDigital", "true");
      if (searchQuery) params.append("search", searchQuery);
      if (selectedMediaFormats.length > 0)
        params.append("mediaFormat", selectedMediaFormats.join(","));
      if (retroCompatible !== undefined)
        params.append("retroCompatible", retroCompatible.toString());

      if (storageRanges.length > 0) {
        const { storageMin, storageMax } = calculateStorageRange(storageRanges);
        if (storageMin !== undefined) params.append("storageMin", storageMin.toString());
        if (storageMax !== undefined) params.append("storageMax", storageMax.toString());
      }

      return apiFetch(`/consoles?${params.toString()}`);
    },
    enabled: initialized,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

function calculateStorageRange(ranges: string[]): { storageMin?: number; storageMax?: number } {
  if (ranges.length === 0) return {};

  // Inicializar com valores extremos
  let overallMin = Infinity;
  let overallMax = -Infinity;

  ranges.forEach((range) => {
    let min: number, max: number;

    switch (range) {
      case "0-1":
        min = 0;
        max = 1;
        break;
      case "2-64":
        min = 2;
        max = 64;
        break;
      case "65-512":
        min = 65;
        max = 512;
        break;
      case "513-":
        min = 513;
        max = Infinity;
        break;
      default:
        return; // Pula ranges desconhecidos
    }

    // Atualizar os valores gerais
    overallMin = Math.min(overallMin, min);
    overallMax = Math.max(overallMax, max);
  });

  return {
    storageMin: overallMin === Infinity ? undefined : overallMin,
    storageMax: overallMax === Infinity || overallMax === -Infinity ? undefined : overallMax,
  };
}
