// hooks/useGameFilters.ts
"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface UseGameFiltersReturn {
  selectedGenres: number[];
  selectedPlatforms: number[];
  showOnlyFavorites: boolean;
  handleGenreChange: (genres: number[]) => void;
  handlePlatformChange: (platforms: number[]) => void;
  handleFavoriteChange: (showOnlyFavorites: boolean) => void;
  clearFilters: () => void;
}

export const useGameFilters = (): UseGameFiltersReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    searchParams.get("genres")?.split(",").map(Number).filter(Boolean) || [],
  );

  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>(
    searchParams.get("platforms")?.split(",").map(Number).filter(Boolean) || [],
  );

  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(
    searchParams.get("isFavorite") === "true",
  );

  const updateURL = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const handleGenreChange = useCallback(
    (genres: number[]) => {
      setSelectedGenres(genres);
      updateURL({ genres: genres.join(",") });
    },
    [updateURL],
  );

  const handlePlatformChange = useCallback(
    (platforms: number[]) => {
      setSelectedPlatforms(platforms);
      updateURL({ platforms: platforms.join(",") });
    },
    [updateURL],
  );

  const handleFavoriteChange = useCallback(
    (favorites: boolean) => {
      setShowOnlyFavorites(favorites);
      updateURL({ isFavorite: favorites ? "true" : "" });
    },
    [updateURL],
  );

  const clearFilters = useCallback(() => {
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    setShowOnlyFavorites(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("genres");
    params.delete("platforms");
    params.delete("isFavorite");
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  return {
    selectedGenres,
    selectedPlatforms,
    showOnlyFavorites,
    handleGenreChange,
    handlePlatformChange,
    handleFavoriteChange,
    clearFilters,
  };
};
