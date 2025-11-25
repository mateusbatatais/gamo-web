// hooks/useMarketplaceFilters.ts
"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface UseMarketplaceFiltersReturn {
  selectedItemTypes: string[];
  selectedStatus: string;
  selectedConditions: string[];
  handleItemTypeChange: (itemTypes: string[]) => void;
  handleStatusChange: (status: string) => void;
  handleConditionChange: (conditions: string[]) => void;
  clearFilters: () => void;
}

export function useMarketplaceFilters(): UseMarketplaceFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>(
    searchParams.get("itemType")?.split(",").filter(Boolean) || [],
  );

  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get("status") || "SELLING",
  );

  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    searchParams.get("condition")?.split(",").filter(Boolean) || [],
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

  const clearFilters = useCallback(() => {
    setSelectedItemTypes([]);
    setSelectedStatus("SELLING");
    setSelectedConditions([]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("itemType");
    params.set("status", "SELLING");
    params.delete("condition");
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  return {
    selectedItemTypes,
    selectedStatus,
    selectedConditions,
    handleItemTypeChange,
    handleStatusChange,
    handleConditionChange,
    clearFilters,
  };
}
