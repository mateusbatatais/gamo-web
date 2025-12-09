import { useQuery } from "@tanstack/react-query";
import { UserGame } from "@/@types/collection.types";

export interface PlayingNowResult {
  items: UserGame[];
  total: number;
}

const fetchPlayingNowGames = async (slug: string): Promise<PlayingNowResult> => {
  const params = new URLSearchParams({
    progressMin: "0.01",
    progressMax: "9.99",
    abandoned: "false",
    sort: "updatedAt-desc",
    take: "6", // Fetch 6 to check if > 5. Although API returns total count too.
    page: "1",
    perPage: "6",
  });

  const response = await fetch(`/api/v1/public-profile/${slug}/games?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch playing now games");
  }
  return response.json();
};

export const usePlayingNowGames = (slug: string) => {
  return useQuery({
    queryKey: ["playingNow", slug],
    queryFn: () => fetchPlayingNowGames(slug),
    enabled: !!slug,
  });
};
