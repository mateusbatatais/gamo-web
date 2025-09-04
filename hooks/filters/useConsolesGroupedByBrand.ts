// hooks/useConsolesGroupedByBrand.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface Console {
  id: number;
  slug: string;
  name: string;
  brand: {
    id: number;
    slug: string;
    name: string;
  };
}

export interface ConsoleGroup {
  slug: string;
  name: string;
  consoles: Console[];
}

export default function useConsolesGroupedByBrand(locale: string = "pt") {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<ConsoleGroup[], Error>({
    queryKey: ["consolesGroupedByBrand", locale],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");

      // Buscar consoles - ajuste o endpoint conforme necessário
      const consoles: Console[] = await apiFetch(`/consoles?locale=${locale}&perPage=100`);

      // Agrupar consoles por marca
      const groupsMap = consoles.reduce(
        (acc, consoleItem) => {
          const brandSlug = consoleItem.brand.slug;
          if (!acc[brandSlug]) {
            acc[brandSlug] = {
              slug: brandSlug,
              name: consoleItem.brand.name,
              consoles: [],
            };
          }
          acc[brandSlug].consoles.push(consoleItem);
          return acc;
        },
        {} as Record<string, ConsoleGroup>,
      );

      return Object.values(groupsMap);
    },
    enabled: initialized,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
  });
}
