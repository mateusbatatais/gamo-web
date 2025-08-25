// hooks/filters/useModels.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface Model {
  slug: string;
  name: string;
}

export default function useModels() {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<Model[], Error>({
    queryKey: ["models"],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");
      return apiFetch("/consoles/models");
    },
    enabled: initialized,
    staleTime: 30 * 24 * 60 * 60 * 1000,
  });
}
