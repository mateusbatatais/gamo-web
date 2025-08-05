import { GameDetails, GameWithStats, SeriesResponse } from "@/@types/game";
import { apiFetch } from "@/utils/api";
import { useState, useEffect } from "react";

// Função para buscar série com cache
const fetchCachedSeries = async (slug: string) => {
  const ONE_MONTH = 30 * 24 * 60 * 60 * 1000; // 1 mês em ms

  // Verificar cache válido
  const cachedData = localStorage.getItem(slug);
  if (cachedData) {
    const { timestamp, data } = JSON.parse(cachedData);
    if (Date.now() - timestamp < ONE_MONTH) {
      return data;
    }
  }

  // Buscar da API se cache inválido/inexistente
  try {
    const series = await apiFetch<SeriesResponse>(`/games/series/${slug}`);
    localStorage.setItem(
      slug,
      JSON.stringify({
        timestamp: Date.now(),
        data: series,
      }),
    );
    return series;
  } catch (error) {
    console.error("Failed to fetch series:", error);
    return null;
  }
};

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

    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar detalhes principais do jogo
        const gameData = await apiFetch<GameDetails>(`/games/${slug}`);

        // Buscar série se existir slug de série
        let series: SeriesResponse | null = null;
        if (gameData.series?.slug) {
          series = await fetchCachedSeries(gameData.series.slug);
        }

        // Combinar dados
        setData({
          ...gameData,
          series,
        });
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

    fetchData();
  }, [slug]);

  return { data, loading, error };
}
