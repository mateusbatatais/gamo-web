// hooks/useAccessorySubTypes.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface AccessorySubType {
  slug: string;
  name: string;
}

export default function useAccessorySubTypes(type?: string, locale: string = "pt") {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<AccessorySubType[], Error>({
    queryKey: ["accessorySubTypes", type, locale],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");

      const params = new URLSearchParams({ locale });
      if (type) params.append("type", type);

      return apiFetch(`/accessories/subtypes?${params.toString()}`);
    },
    enabled: initialized && !!type, // Só busca subtipos se um tipo for selecionado
    staleTime: 24 * 60 * 60 * 1000,
  });
}
