"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { UserGame } from "@/@types/collection.types";

export function usePublicUserGame(slug: string, gameId: number, options?: { enabled?: boolean }) {
  const { apiFetch } = useApiClient();

  return useQuery<UserGame>({
    queryKey: ["publicUserGame", slug, gameId],
    queryFn: () => apiFetch(`/public/profile/${slug}/games/${gameId}`),
    enabled: options?.enabled && !!slug && !!gameId,
    staleTime: 5 * 60 * 1000,
  });
}
