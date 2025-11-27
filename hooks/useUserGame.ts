"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { UserGame } from "@/@types/collection.types";

export function useUserGame(id: number, options?: { enabled?: boolean }) {
  const { apiFetch } = useApiClient();

  return useQuery<UserGame>({
    queryKey: ["userGame", id],
    queryFn: () => apiFetch(`/user-games/${id}`),
    enabled: options?.enabled && !!id,
  });
}
