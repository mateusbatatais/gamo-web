// hooks/useConsolesForFilter.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConsoleForFilter {
  id: number;
  slug: string;
  name: string;
  brand: {
    id: number;
    slug: string;
    name: string;
  };
}

export default function useConsolesForFilter(locale: string = "pt") {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<ConsoleForFilter[], Error>({
    queryKey: ["consolesForFilter", locale],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");
      return apiFetch(`/consoles/for-filter?locale=${locale}`);
    },
    enabled: initialized,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
