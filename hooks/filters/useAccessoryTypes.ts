// hooks/useAccessoryTypes.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface AccessoryType {
  slug: string;
  name: string;
}

export default function useAccessoryTypes(locale: string = "pt") {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<AccessoryType[], Error>({
    queryKey: ["accessoryTypes", locale],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");
      return apiFetch(`/accessories/types?locale=${locale}`);
    },
    enabled: initialized,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
  });
}
