// hooks/usePlatformsCache.ts
"use client";

import { useState, useEffect } from "react";
import usePlatforms from "./filters/usePlatforms";

interface Platform {
  id: number;
  name: string;
}

export function usePlatformsCache() {
  const { data: platformsData, isLoading, error } = usePlatforms();
  const [platformsMap, setPlatformsMap] = useState<Record<number, string>>({});

  useEffect(() => {
    if (platformsData) {
      // Criar um mapa plano de todas as plataformas
      const allPlatforms: Platform[] = platformsData.results.flatMap(
        (parentPlatform) => parentPlatform.platforms,
      );

      // Criar um objeto de mapeamento { id: name }
      const newPlatformsMap = allPlatforms.reduce(
        (acc, platform) => {
          acc[platform.id] = platform.name;
          return acc;
        },
        {} as Record<number, string>,
      );

      setPlatformsMap(newPlatformsMap);

      // Salvar no localStorage com timestamp
      const cacheData = {
        data: newPlatformsMap,
        timestamp: Date.now(),
      };
      localStorage.setItem("platforms-cache", JSON.stringify(cacheData));
    }
  }, [platformsData]);

  // Carregar do cache se disponível
  useEffect(() => {
    const cachedData = localStorage.getItem("platforms-cache");
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      // Verificar se o cache é válido (1 mês)
      if (Date.now() - timestamp < 30 * 24 * 60 * 60 * 1000) {
        setPlatformsMap(data);
      }
    }
  }, []);

  return {
    platformsMap,
    isLoading,
    error,
  };
}
