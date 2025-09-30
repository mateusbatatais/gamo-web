// src/hooks/usePlatformMatching.ts
"use client";

import { usePlatformsCache } from "./usePlatformsCache";

interface PlatformMatch {
  id: number;
  name: string;
  confidence: number;
}

export function usePlatformMatching() {
  const { platformsMap, isLoading } = usePlatformsCache();

  const findBestPlatformMatch = (platformName: string): PlatformMatch | null => {
    if (!platformName || !platformsMap || isLoading) return null;

    const normalizedSearch = platformName.toLowerCase().trim();

    // Busca exata
    for (const [id, name] of Object.entries(platformsMap)) {
      if (name.toLowerCase() === normalizedSearch) {
        return { id: Number(id), name, confidence: 1.0 };
      }
    }

    // Busca parcial
    for (const [id, name] of Object.entries(platformsMap)) {
      const normalizedName = name.toLowerCase();
      if (normalizedName.includes(normalizedSearch) || normalizedSearch.includes(normalizedName)) {
        return { id: Number(id), name, confidence: 0.8 };
      }
    }

    return null;
  };

  const getPlatformOptions = (): Array<{ value: string; label: string }> => {
    if (!platformsMap || isLoading) return [];

    return Object.entries(platformsMap)
      .map(([id, name]) => ({
        value: id,
        label: name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  return {
    findBestPlatformMatch,
    getPlatformOptions,
    isLoading,
    platformsMap,
  };
}
