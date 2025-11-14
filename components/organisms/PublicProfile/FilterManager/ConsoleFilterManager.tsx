// components/organisms/PublicProfile/FilterManager/ConsoleFilterManager.tsx
"use client";

import React from "react";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import ConsoleFilterContainer from "@/components/molecules/Filter/ConsoleFilterContainer";
import { UseConsoleFiltersReturn } from "@/hooks/useConsoleFilters";

interface ConsoleFilterManagerProps {
  isFilterOpen: boolean;
  onFilterClose: () => void;
  consoleFilters: UseConsoleFiltersReturn;
}

export const ConsoleFilterManager: React.FC<ConsoleFilterManagerProps> = ({
  isFilterOpen,
  onFilterClose,
  consoleFilters,
}) => {
  return (
    <Drawer
      open={isFilterOpen}
      onClose={onFilterClose}
      title="Filtrar Consoles"
      anchor="right"
      className="w-full max-w-md"
    >
      <ConsoleFilterContainer
        onBrandChange={consoleFilters.handleBrandChange}
        onGenerationChange={consoleFilters.handleGenerationChange}
        onModelChange={consoleFilters.handleModelChange}
        onAllDigitalChange={consoleFilters.handleAllDigitalChange}
        onTypeChange={consoleFilters.handleTypeChange}
        onMediaFormatChange={consoleFilters.handleMediaFormatChange}
        onRetroCompatibleChange={consoleFilters.handleRetroCompatibleChange}
        onStorageChange={consoleFilters.handleStorageChange}
        selectedStorageRanges={consoleFilters.selectedStorageRanges}
        selectedBrands={consoleFilters.selectedBrands}
        selectedGenerations={consoleFilters.selectedGenerations}
        selectedModels={consoleFilters.selectedModels}
        selectedAllDigital={consoleFilters.selectedAllDigital}
        selectedTypes={consoleFilters.selectedTypes}
        selectedMediaFormats={consoleFilters.selectedMediaFormats}
        retroCompatible={consoleFilters.retroCompatible}
        clearFilters={consoleFilters.clearFilters}
      />
    </Drawer>
  );
};
