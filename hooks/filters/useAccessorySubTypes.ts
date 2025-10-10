// hooks/useAccessorySubTypes.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface AccessorySubType {
  slug: string;
  name: string;
}

export default function useAccessorySubTypes(types: string[] = [], locale: string = "pt") {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<AccessorySubType[], Error>({
    queryKey: ["accessorySubTypes", types.sort().join(","), locale], // Ordena para cache consistente
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");

      // Se não há tipos selecionados, retorna array vazio
      if (types.length === 0) {
        return [];
      }

      const params = new URLSearchParams({ locale });

      // Envia como string separada por vírgulas: types=type1,type2,type3
      params.append("types", types.join(","));

      return apiFetch(`/accessories/subtypes?${params.toString()}`);
    },
    enabled: initialized && types.length > 0, // Habilita apenas se houver tipos selecionados
    staleTime: 24 * 60 * 60 * 1000,
  });
}
