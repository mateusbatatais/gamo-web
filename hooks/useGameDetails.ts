// hooks/useGameDetails.ts
import { GameDetails, GameWithStats } from "@/@types/game";
import { apiFetch } from "@/utils/api";
import { useState, useEffect } from "react";

export default function useGameDetails(slug: string) {
  const [data, setData] = useState<GameWithStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Slug is required");
      setLoading(false);
      return;
    }

    const fetchGame = async () => {
      try {
        setLoading(true);
        const result = await apiFetch<GameDetails>(`/games/${slug}`);
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [slug]);

  return { data, loading, error };
}
