// hooks/usePlatformMapping.ts
import { useMemo } from "react";
import usePlatforms, { Platform } from "./filters/usePlatforms";

export const usePlatformMapping = () => {
  const { data: platformsData } = usePlatforms();

  // Cria um mapa de ID -> Platform para busca rápida
  const platformMap = useMemo(() => {
    const map = new Map<number, Platform>();

    if (platformsData?.results) {
      platformsData.results.forEach((group) => {
        group.platforms.forEach((platform) => {
          map.set(platform.id, platform);
        });
      });
    }

    return map;
  }, [platformsData]);

  const getPlatformName = (platformId: number): string => {
    return platformMap.get(platformId)?.name || platformId.toString();
  };

  const getPlatformById = (platformId: number): Platform | undefined => {
    return platformMap.get(platformId);
  };

  const getPlatformsByIds = (platformIds: number[]): Platform[] => {
    return platformIds.map((id) => platformMap.get(id)).filter(Boolean) as Platform[];
  };

  return {
    getPlatformName,
    getPlatformById,
    getPlatformsByIds,
    platformMap,
  };
};
