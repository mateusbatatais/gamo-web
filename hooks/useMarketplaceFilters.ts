// hooks/useMarketplaceFilters.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface UseMarketplaceFiltersReturn {
  selectedItemTypes: string[];
  selectedStatus: string;
  selectedConditions: string[];
  // General filters
  priceMin: string;
  priceMax: string;
  hasBox: boolean;
  hasManual: boolean;
  acceptsTrade: boolean;
  // Game filters
  selectedGenres: number[];
  selectedPlatforms: number[];
  // Console filters
  selectedBrands: string[];
  selectedGenerations: string[];
  selectedModels: string[];
  selectedConsoleTypes: string[];
  selectedMediaFormats: string[];
  selectedStorageRanges: string[];
  allDigital: boolean;
  retroCompatible: boolean;
  // Accessory filters
  selectedAccessoryTypes: string[];
  selectedAccessorySubTypes: string[];
  selectedConsoles: string[];
  // Handlers
  handleItemTypeChange: (itemTypes: string[]) => void;
  handleStatusChange: (status: string) => void;
  handleConditionChange: (conditions: string[]) => void;
  handlePriceMinChange: (value: string) => void;
  handlePriceMaxChange: (value: string) => void;
  handleHasBoxChange: (value: boolean) => void;
  handleHasManualChange: (value: boolean) => void;
  handleAcceptsTradeChange: (value: boolean) => void;
  handleGenreChange: (genres: number[]) => void;
  handlePlatformChange: (platforms: number[]) => void;
  handleBrandChange: (brands: string[]) => void;
  handleGenerationChange: (generations: string[]) => void;
  handleModelChange: (models: string[]) => void;
  handleConsoleTypeChange: (types: string[]) => void;
  handleMediaFormatChange: (formats: string[]) => void;
  handleStorageChange: (ranges: string[]) => void;
  handleAllDigitalChange: (value: boolean) => void;
  handleRetroCompatibleChange: (value: boolean) => void;
  handleAccessoryTypeChange: (types: string[]) => void;
  handleAccessorySubTypeChange: (subTypes: string[]) => void;
  handleConsoleChange: (consoles: string[]) => void;
  clearFilters: () => void;
}

export function useMarketplaceFilters(): UseMarketplaceFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Basic filters
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>(
    searchParams.get("itemType")?.split(",").filter(Boolean) || [],
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get("status") || "SELLING",
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    searchParams.get("condition")?.split(",").filter(Boolean) || [],
  );

  // General filters
  const [priceMin, setPriceMin] = useState<string>(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState<string>(searchParams.get("priceMax") || "");
  const [hasBox, setHasBox] = useState<boolean>(searchParams.get("hasBox") === "true");
  const [hasManual, setHasManual] = useState<boolean>(searchParams.get("hasManual") === "true");
  const [acceptsTrade, setAcceptsTrade] = useState<boolean>(
    searchParams.get("acceptsTrade") === "true",
  );

  // Game filters
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    searchParams.get("genres")?.split(",").map(Number).filter(Boolean) || [],
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>(
    searchParams.get("platforms")?.split(",").map(Number).filter(Boolean) || [],
  );

  // Console filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",").filter(Boolean) || [],
  );
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>(
    searchParams.get("generations")?.split(",").filter(Boolean) || [],
  );
  const [selectedModels, setSelectedModels] = useState<string[]>(
    searchParams.get("models")?.split(",").filter(Boolean) || [],
  );
  const [selectedConsoleTypes, setSelectedConsoleTypes] = useState<string[]>(
    searchParams.get("consoleTypes")?.split(",").filter(Boolean) || [],
  );
  const [selectedMediaFormats, setSelectedMediaFormats] = useState<string[]>(
    searchParams.get("mediaFormats")?.split(",").filter(Boolean) || [],
  );
  const [selectedStorageRanges, setSelectedStorageRanges] = useState<string[]>(
    searchParams.get("storage")?.split(",").filter(Boolean) || [],
  );
  const [allDigital, setAllDigital] = useState<boolean>(searchParams.get("allDigital") === "true");
  const [retroCompatible, setRetroCompatible] = useState<boolean>(
    searchParams.get("retroCompatible") === "true",
  );

  // Accessory filters
  const [selectedAccessoryTypes, setSelectedAccessoryTypes] = useState<string[]>(
    searchParams.get("accessoryTypes")?.split(",").filter(Boolean) || [],
  );
  const [selectedAccessorySubTypes, setSelectedAccessorySubTypes] = useState<string[]>(
    searchParams.get("accessorySubTypes")?.split(",").filter(Boolean) || [],
  );
  const [selectedConsoles, setSelectedConsoles] = useState<string[]>(
    searchParams.get("consoles")?.split(",").filter(Boolean) || [],
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

  // Clear type-specific filters when item type changes
  useEffect(() => {
    const singleType = selectedItemTypes.length === 1 ? selectedItemTypes[0] : null;

    // Clear game filters if not GAME
    if (singleType !== "GAME" && (selectedGenres.length > 0 || selectedPlatforms.length > 0)) {
      setSelectedGenres([]);
      setSelectedPlatforms([]);
      updateURL({ genres: "", platforms: "" });
    }

    // Clear console filters if not CONSOLE
    if (
      singleType !== "CONSOLE" &&
      (selectedBrands.length > 0 ||
        selectedGenerations.length > 0 ||
        selectedModels.length > 0 ||
        selectedConsoleTypes.length > 0 ||
        selectedMediaFormats.length > 0 ||
        selectedStorageRanges.length > 0 ||
        allDigital ||
        retroCompatible)
    ) {
      setSelectedBrands([]);
      setSelectedGenerations([]);
      setSelectedModels([]);
      setSelectedConsoleTypes([]);
      setSelectedMediaFormats([]);
      setSelectedStorageRanges([]);
      setAllDigital(false);
      setRetroCompatible(false);
      updateURL({
        brands: "",
        generations: "",
        models: "",
        consoleTypes: "",
        mediaFormats: "",
        storage: "",
        allDigital: "",
        retroCompatible: "",
      });
    }

    // Clear accessory filters if not ACCESSORY
    if (
      singleType !== "ACCESSORY" &&
      (selectedAccessoryTypes.length > 0 ||
        selectedAccessorySubTypes.length > 0 ||
        selectedConsoles.length > 0)
    ) {
      setSelectedAccessoryTypes([]);
      setSelectedAccessorySubTypes([]);
      setSelectedConsoles([]);
      updateURL({ accessoryTypes: "", accessorySubTypes: "", consoles: "" });
    }
  }, [selectedItemTypes]); // Only depend on selectedItemTypes

  const handleItemTypeChange = useCallback(
    (itemTypes: string[]) => {
      setSelectedItemTypes(itemTypes);
      updateURL({ itemType: itemTypes.join(",") });
    },
    [updateURL],
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      setSelectedStatus(status);
      updateURL({ status });
    },
    [updateURL],
  );

  const handleConditionChange = useCallback(
    (conditions: string[]) => {
      setSelectedConditions(conditions);
      updateURL({ condition: conditions.join(",") });
    },
    [updateURL],
  );

  // General filter handlers
  const handlePriceMinChange = useCallback(
    (value: string) => {
      setPriceMin(value);
      updateURL({ priceMin: value });
    },
    [updateURL],
  );

  const handlePriceMaxChange = useCallback(
    (value: string) => {
      setPriceMax(value);
      updateURL({ priceMax: value });
    },
    [updateURL],
  );

  const handleHasBoxChange = useCallback(
    (value: boolean) => {
      setHasBox(value);
      updateURL({ hasBox: value ? "true" : "" });
    },
    [updateURL],
  );

  const handleHasManualChange = useCallback(
    (value: boolean) => {
      setHasManual(value);
      updateURL({ hasManual: value ? "true" : "" });
    },
    [updateURL],
  );

  const handleAcceptsTradeChange = useCallback(
    (value: boolean) => {
      setAcceptsTrade(value);
      updateURL({ acceptsTrade: value ? "true" : "" });
    },
    [updateURL],
  );

  // Game handlers
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

  // Console handlers
  const handleBrandChange = useCallback(
    (brands: string[]) => {
      setSelectedBrands(brands);
      updateURL({ brands: brands.join(",") });
    },
    [updateURL],
  );

  const handleGenerationChange = useCallback(
    (generations: string[]) => {
      setSelectedGenerations(generations);
      updateURL({ generations: generations.join(",") });
    },
    [updateURL],
  );

  const handleModelChange = useCallback(
    (models: string[]) => {
      setSelectedModels(models);
      updateURL({ models: models.join(",") });
    },
    [updateURL],
  );

  const handleConsoleTypeChange = useCallback(
    (types: string[]) => {
      setSelectedConsoleTypes(types);
      updateURL({ consoleTypes: types.join(",") });
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

  const handleStorageChange = useCallback(
    (ranges: string[]) => {
      setSelectedStorageRanges(ranges);
      updateURL({ storage: ranges.join(",") });
    },
    [updateURL],
  );

  const handleAllDigitalChange = useCallback(
    (value: boolean) => {
      setAllDigital(value);
      updateURL({ allDigital: value ? "true" : "" });
    },
    [updateURL],
  );

  const handleRetroCompatibleChange = useCallback(
    (value: boolean) => {
      setRetroCompatible(value);
      updateURL({ retroCompatible: value ? "true" : "" });
    },
    [updateURL],
  );

  // Accessory handlers
  const handleAccessoryTypeChange = useCallback(
    (types: string[]) => {
      setSelectedAccessoryTypes(types);
      updateURL({ accessoryTypes: types.join(",") });
    },
    [updateURL],
  );

  const handleAccessorySubTypeChange = useCallback(
    (subTypes: string[]) => {
      setSelectedAccessorySubTypes(subTypes);
      updateURL({ accessorySubTypes: subTypes.join(",") });
    },
    [updateURL],
  );

  const handleConsoleChange = useCallback(
    (consoles: string[]) => {
      setSelectedConsoles(consoles);
      updateURL({ consoles: consoles.join(",") });
    },
    [updateURL],
  );

  const clearFilters = useCallback(() => {
    // Reset basic filters
    setSelectedItemTypes([]);
    setSelectedStatus("SELLING");
    setSelectedConditions([]);

    // Reset general filters
    setPriceMin("");
    setPriceMax("");
    setHasBox(false);
    setHasManual(false);
    setAcceptsTrade(false);

    // Reset game filters
    setSelectedGenres([]);
    setSelectedPlatforms([]);

    // Reset console filters
    setSelectedBrands([]);
    setSelectedGenerations([]);
    setSelectedModels([]);
    setSelectedConsoleTypes([]);
    setSelectedMediaFormats([]);
    setSelectedStorageRanges([]);
    setAllDigital(false);
    setRetroCompatible(false);

    // Reset accessory filters
    setSelectedAccessoryTypes([]);
    setSelectedAccessorySubTypes([]);
    setSelectedConsoles([]);

    // Clear URL params
    const params = new URLSearchParams();
    params.set("status", "SELLING");
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname]);

  return {
    selectedItemTypes,
    selectedStatus,
    selectedConditions,
    priceMin,
    priceMax,
    hasBox,
    hasManual,
    acceptsTrade,
    selectedGenres,
    selectedPlatforms,
    selectedBrands,
    selectedGenerations,
    selectedModels,
    selectedConsoleTypes,
    selectedMediaFormats,
    selectedStorageRanges,
    allDigital,
    retroCompatible,
    selectedAccessoryTypes,
    selectedAccessorySubTypes,
    selectedConsoles,
    handleItemTypeChange,
    handleStatusChange,
    handleConditionChange,
    handlePriceMinChange,
    handlePriceMaxChange,
    handleHasBoxChange,
    handleHasManualChange,
    handleAcceptsTradeChange,
    handleGenreChange,
    handlePlatformChange,
    handleBrandChange,
    handleGenerationChange,
    handleModelChange,
    handleConsoleTypeChange,
    handleMediaFormatChange,
    handleStorageChange,
    handleAllDigitalChange,
    handleRetroCompatibleChange,
    handleAccessoryTypeChange,
    handleAccessorySubTypeChange,
    handleConsoleChange,
    clearFilters,
  };
}
