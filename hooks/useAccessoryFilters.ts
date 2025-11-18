// hooks/useAccessoryFilters.ts
"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface UseAccessoryFiltersReturn {
  selectedTypes: string[];
  selectedSubTypes: string[];
  selectedConsoles: string[];
  showOnlyFavorites: boolean;
  handleTypeChange: (types: string[]) => void;
  handleSubTypeChange: (subTypes: string[]) => void;
  handleConsoleChange: (consoles: string[]) => void;
  handleFavoriteChange: (showOnlyFavorites: boolean) => void;
  clearFilters: () => void;
}

export const useAccessoryFilters = (): UseAccessoryFiltersReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type")?.split(",").filter(Boolean) || [],
  );

  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>(
    searchParams.get("subType")?.split(",").filter(Boolean) || [],
  );

  const [selectedConsoles, setSelectedConsoles] = useState<string[]>(
    searchParams.get("console")?.split(",").filter(Boolean) || [],
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

  const handleTypeChange = useCallback(
    (types: string[]) => {
      setSelectedTypes(types);
      updateURL({ type: types.join(",") });
    },
    [updateURL],
  );

  const handleSubTypeChange = useCallback(
    (subTypes: string[]) => {
      setSelectedSubTypes(subTypes);
      updateURL({ subType: subTypes.join(",") });
    },
    [updateURL],
  );

  const handleConsoleChange = useCallback(
    (consoles: string[]) => {
      setSelectedConsoles(consoles);
      updateURL({ console: consoles.join(",") });
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
    setSelectedTypes([]);
    setSelectedSubTypes([]);
    setSelectedConsoles([]);
    setShowOnlyFavorites(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("subType");
    params.delete("console");
    params.delete("isFavorite");
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  return {
    selectedTypes,
    selectedSubTypes,
    selectedConsoles,
    showOnlyFavorites,
    handleTypeChange,
    handleSubTypeChange,
    handleConsoleChange,
    handleFavoriteChange,
    clearFilters,
  };
};
