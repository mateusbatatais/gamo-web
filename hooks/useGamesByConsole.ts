// hooks/useGamesByConsole.ts
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { Game, PaginatedResponse } from "@/@types/catalog.types";

export function useGamesByConsole(consoleId: number, enabled = true) {
  const { apiFetch } = useApiClient();

  return useQuery({
    queryKey: ["gamesByConsole", consoleId],
    queryFn: async (): Promise<Game[]> => {
      if (!consoleId) return [];
      const response = await apiFetch<PaginatedResponse<Game>>(
        `/games?platforms=${consoleId}&perPage=100`,
      );
      return response.items;
    },
    enabled: !!consoleId && enabled,
  });
}
