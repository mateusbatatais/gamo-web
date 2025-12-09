import { useQuery } from "@tanstack/react-query";
import { UserGame } from "@/@types/collection.types";
import { useApiClient } from "@/lib/api-client";
import { PaginatedResponse } from "@/@types/catalog.types";

export const usePlayingNowGames = (slug: string) => {
  const { apiFetch } = useApiClient();

  const params = new URLSearchParams({
    progressMin: "0.01",
    progressMax: "9.99",
    abandoned: "false",
    sort: "updatedAt-desc",
    take: "6",
    page: "1",
    perPage: "6",
  });

  return useQuery<PaginatedResponse<UserGame>>({
    queryKey: ["playingNow", slug],
    queryFn: () => apiFetch(`/public/profile/${slug}/games?${params.toString()}`),
    enabled: !!slug,
  });
};
