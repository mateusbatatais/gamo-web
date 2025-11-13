// hooks/useConsoleFilters.ts
"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface UseConsoleFiltersReturn {
  selectedBrands: string[];
  selectedGenerations: string[];
  selectedModels: string[];
  selectedTypes: string[];
  selectedAllDigital: boolean;
  selectedMediaFormats: string[];
  retroCompatible: boolean;
  selectedStorageRanges: string[];
  handleBrandChange: (brands: string[]) => void;
  handleGenerationChange: (generations: string[]) => void;
  handleModelChange: (models: string[]) => void;
  handleTypeChange: (types: string[]) => void;
  handleAllDigitalChange: (allDigital: boolean) => void;
  handleMediaFormatChange: (formats: string[]) => void;
  handleRetroCompatibleChange: (isRetroCompatible: boolean) => void;
  handleStorageChange: (ranges: string[]) => void;
  clearFilters: () => void;
}

export const useConsoleFilters = (): UseConsoleFiltersReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Estados dos filtros
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brand")?.split(",").filter(Boolean) || [],
  );

  const [selectedGenerations, setSelectedGenerations] = useState<string[]>(
    searchParams.get("generation")?.split(",").filter(Boolean) || [],
  );

  const [selectedModels, setSelectedModels] = useState<string[]>(
    searchParams.get("model")?.split(",").filter(Boolean) || [],
  );

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type")?.split(",").filter(Boolean) || [],
  );

  const [selectedAllDigital, setSelectedAllDigital] = useState<boolean>(
    searchParams.get("allDigital") === "true",
  );

  const [selectedMediaFormats, setSelectedMediaFormats] = useState<string[]>(
    searchParams.get("mediaFormats")?.split(",").filter(Boolean) || [],
  );

  const [retroCompatible, setRetroCompatible] = useState<boolean>(
    searchParams.get("retroCompatible") === "true",
  );

  const [selectedStorageRanges, setSelectedStorageRanges] = useState<string[]>(
    searchParams.get("storage")?.split(",").filter(Boolean) || [],
  );

  // Função para atualizar URL
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

  // Handlers para cada filtro
  const handleBrandChange = useCallback(
    (brands: string[]) => {
      setSelectedBrands(brands);
      updateURL({ brand: brands.join(",") });
    },
    [updateURL],
  );

  const handleGenerationChange = useCallback(
    (generations: string[]) => {
      setSelectedGenerations(generations);
      updateURL({ generation: generations.join(",") });
    },
    [updateURL],
  );

  const handleModelChange = useCallback(
    (models: string[]) => {
      setSelectedModels(models);
      updateURL({ model: models.join(",") });
    },
    [updateURL],
  );

  const handleTypeChange = useCallback(
    (types: string[]) => {
      setSelectedTypes(types);
      updateURL({ type: types.join(",") });
    },
    [updateURL],
  );

  const handleAllDigitalChange = useCallback(
    (allDigital: boolean) => {
      setSelectedAllDigital(allDigital);
      updateURL({ allDigital: allDigital.toString() });
    },
    [updateURL],
  );

  const handleMediaFormatChange = useCallback(
    (formats: string[]) => {
      setSelectedMediaFormats(formats);
      updateURL({ mediaFormats: formats.join(",") });
    },
    [updateURL],
  );

  const handleRetroCompatibleChange = useCallback(
    (isRetroCompatible: boolean) => {
      setRetroCompatible(isRetroCompatible);
      updateURL({ retroCompatible: isRetroCompatible.toString() });
    },
    [updateURL],
  );

  const handleStorageChange = useCallback(
    (ranges: string[]) => {
      setSelectedStorageRanges(ranges);
      updateURL({ storage: ranges.join(",") });
    },
    [updateURL],
  );

  // Limpar todos os filtros
  const clearFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedGenerations([]);
    setSelectedModels([]);
    setSelectedTypes([]);
    setSelectedAllDigital(false);
    setSelectedMediaFormats([]);
    setRetroCompatible(false);
    setSelectedStorageRanges([]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("brand");
    params.delete("generation");
    params.delete("model");
    params.delete("type");
    params.delete("allDigital");
    params.delete("mediaFormats");
    params.delete("retroCompatible");
    params.delete("storage");
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  return {
    selectedBrands,
    selectedGenerations,
    selectedModels,
    selectedTypes,
    selectedAllDigital,
    selectedMediaFormats,
    retroCompatible,
    selectedStorageRanges,
    handleBrandChange,
    handleGenerationChange,
    handleModelChange,
    handleTypeChange,
    handleAllDigitalChange,
    handleMediaFormatChange,
    handleRetroCompatibleChange,
    handleStorageChange,
    clearFilters,
  };
};
