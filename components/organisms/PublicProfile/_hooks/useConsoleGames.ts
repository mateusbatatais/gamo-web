// hooks/useConsoleGames.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { UserGame, UserConsole } from "@/@types/collection.types";
import { PaginatedResponse } from "@/@types/catalog.types";

interface UseConsoleGamesProps {
  slug: string;
  consoleId: number;
  locale: string;
  page: number;
  perPage: number;
  sort: string;
  searchQuery: string;
}

interface ConsoleWithGames extends UserConsole {
  skinImageUrl?: string;
  variantImageUrl?: string;
}

interface UseConsoleGamesReturn {
  console: ConsoleWithGames | undefined;
  games: UserGame[];
  gamesMeta: PaginatedResponse<UserGame>["meta"] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useConsoleGames({
  slug,
  consoleId,
  locale,
  page,
  perPage,
  sort,
  searchQuery,
}: UseConsoleGamesProps): UseConsoleGamesReturn {
  const { apiFetch } = useApiClient();

  const queryParams = new URLSearchParams();
  queryParams.append("locale", locale);
  queryParams.append("page", page.toString());
  queryParams.append("perPage", perPage.toString());
  if (sort) queryParams.append("sort", sort);
  if (searchQuery) queryParams.append("search", searchQuery);

  const { data, isLoading, error } = useQuery<{
    console: ConsoleWithGames;
    games: PaginatedResponse<UserGame>;
  }>({
    queryKey: ["consoleGames", slug, consoleId, locale, page, perPage, sort, searchQuery],
    queryFn: () =>
      apiFetch(`/public/profile/${slug}/console/${consoleId}/games?${queryParams.toString()}`),
    staleTime: 5 * 60 * 1000,
  });

  return {
    console: data?.console,
    games: data?.games.items || [],
    gamesMeta: data?.games.meta,
    isLoading,
    error: error || null,
  };
}
