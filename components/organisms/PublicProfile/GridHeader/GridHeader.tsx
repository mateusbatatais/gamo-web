// components/organisms/PublicProfile/GridHeader/GridHeader.tsx
"use client";

import React from "react";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { SortSelect, SortOption } from "@/components/molecules/SortSelect/SortSelect";
import { ToggleGroup } from "@/components/molecules/ToggleGroup/ToggleGroup";
import { Select } from "@/components/atoms/Select/Select";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { Button } from "@/components/atoms/Button/Button";
import { ViewMode } from "@/@types/catalog-state.types";
import { Settings2 } from "lucide-react";

interface GridHeaderProps {
  // Search (SEM value e onChange)
  searchPath: string;
  searchPlaceholder: string;

  // Toggle Group (opcional - para MarketGrid)
  toggleItems?: { value: string; label: string }[];
  toggleValue?: string;
  onToggleChange?: (value: string) => void;

  // Sort
  sortOptions: SortOption[];
  sortValue: string;
  onSortChange: (sort: string) => void;

  // Per Page
  perPageOptions: { value: string; label: string }[];
  perPageValue: string;
  onPerPageChange: (perPage: string) => void;

  // View Mode
  viewModeOptions: { value: ViewMode; label: string; icon: React.ReactNode }[];
  viewModeValue: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;

  // Filter Button
  onFilterOpen?: () => void;
  showFilterButton?: boolean;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  searchPath,
  searchPlaceholder,
  toggleItems,
  toggleValue,
  onToggleChange,
  sortOptions,
  sortValue,
  onSortChange,
  perPageOptions,
  perPageValue,
  onPerPageChange,
  viewModeOptions,
  viewModeValue,
  onViewModeChange,
  onFilterOpen,
  showFilterButton = true,
}) => {
  return (
    <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="w-full lg:flex-1">
        <SearchBar compact searchPath={searchPath} placeholder={searchPlaceholder} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
        {/* Toggle Group (apenas para MarketGrid) */}
        {toggleItems && toggleValue && onToggleChange && (
          <div className="w-full md:w-full lg:w-auto">
            <ToggleGroup
              items={toggleItems}
              value={toggleValue}
              onChange={onToggleChange}
              variant="secondary"
              size="sm"
              className="w-full lg:w-auto"
            />
          </div>
        )}

        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-start lg:justify-end">
          {/* Sort Select */}
          <SortSelect
            options={sortOptions}
            value={sortValue}
            onChange={onSortChange}
            className="w-full lg:w-auto min-w-50"
          />

          {/* Per Page Select */}
          <Select
            options={perPageOptions}
            value={perPageValue}
            onChange={(e) => onPerPageChange(e.target.value)}
            className="min-w-25"
            size="sm"
          />

          {/* View Mode Dropdown */}
          <Dropdown
            items={viewModeOptions.map((option) => ({
              id: option.value,
              label: option.label,
              icon: option.icon,
              onClick: () => onViewModeChange(option.value),
            }))}
            trigger={
              <Button
                variant="outline"
                size="sm"
                icon={viewModeOptions.find((option) => option.value === viewModeValue)?.icon}
              />
            }
            menuClassName="min-w-40"
          />

          {/* Filter Button (opcional) */}
          {showFilterButton && onFilterOpen && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterOpen}
              icon={<Settings2 size={16} />}
            />
          )}
        </div>
      </div>
    </div>
  );
};
