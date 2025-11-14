// components/organisms/PublicProfile/FilterManager/FilterManager.tsx
"use client";

import React from "react";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import GameFilterContainer from "@/components/molecules/Filter/GameFilterContainer";
import ConsoleFilterContainer from "@/components/molecules/Filter/ConsoleFilterContainer";
import AccessoryFilterContainer from "@/components/molecules/Filter/AccessoryFilterContainer";
import { UseGameFiltersReturn } from "@/hooks/useGameFilters";
import { UseConsoleFiltersReturn } from "@/hooks/useConsoleFilters";
import { UseAccessoryFiltersReturn } from "@/hooks/useAccessoryFilters";

interface FilterManagerProps {
  // Estados dos drawers
  isGameFilterOpen: boolean;
  isConsoleFilterOpen: boolean;
  isAccessoryFilterOpen: boolean;

  // Handlers para fechar drawers
  onGameFilterClose: () => void;
  onConsoleFilterClose: () => void;
  onAccessoryFilterClose: () => void;

  // Filtros
  gameFilters: UseGameFiltersReturn;
  consoleFilters: UseConsoleFiltersReturn;
  accessoryFilters: UseAccessoryFiltersReturn;

  // Locale (para acessórios)
  locale: string;
}

export const FilterManager: React.FC<FilterManagerProps> = ({
  isGameFilterOpen,
  isConsoleFilterOpen,
  isAccessoryFilterOpen,
  onGameFilterClose,
  onConsoleFilterClose,
  onAccessoryFilterClose,
  gameFilters,
  consoleFilters,
  accessoryFilters,
  locale,
}) => {
  return (
    <>
      {/* Drawer de Filtros para Jogos */}
      <Drawer
        open={isGameFilterOpen}
        onClose={onGameFilterClose}
        title="Filtrar Jogos"
        anchor="right"
        className="w-full max-w-md"
      >
        <GameFilterContainer
          onGenreChange={gameFilters.handleGenreChange}
          onPlatformChange={gameFilters.handlePlatformChange}
          selectedGenres={gameFilters.selectedGenres}
          selectedPlatforms={gameFilters.selectedPlatforms}
          clearFilters={gameFilters.clearFilters}
        />
      </Drawer>

      {/* Drawer de Filtros para Consoles */}
      <Drawer
        open={isConsoleFilterOpen}
        onClose={onConsoleFilterClose}
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
          selectedBrands={consoleFilters.selectedBrands}
          selectedGenerations={consoleFilters.selectedGenerations}
          selectedModels={consoleFilters.selectedModels}
          selectedAllDigital={consoleFilters.selectedAllDigital}
          selectedTypes={consoleFilters.selectedTypes}
          selectedMediaFormats={consoleFilters.selectedMediaFormats}
          retroCompatible={consoleFilters.retroCompatible}
          selectedStorageRanges={consoleFilters.selectedStorageRanges}
          clearFilters={consoleFilters.clearFilters}
        />
      </Drawer>

      {/* Drawer de Filtros para Acessórios */}
      <Drawer
        open={isAccessoryFilterOpen}
        onClose={onAccessoryFilterClose}
        title="Filtrar Acessórios"
        anchor="right"
        className="w-full max-w-md"
      >
        <AccessoryFilterContainer
          selectedTypes={accessoryFilters.selectedTypes}
          selectedSubTypes={accessoryFilters.selectedSubTypes}
          selectedConsoles={accessoryFilters.selectedConsoles}
          onTypeChange={accessoryFilters.handleTypeChange}
          onSubTypeChange={accessoryFilters.handleSubTypeChange}
          onConsoleChange={accessoryFilters.handleConsoleChange}
          clearFilters={accessoryFilters.clearFilters}
          locale={locale}
        />
      </Drawer>
    </>
  );
};
