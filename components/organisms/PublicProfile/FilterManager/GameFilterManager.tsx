// components/organisms/PublicProfile/FilterManager/GameFilterManager.tsx
"use client";

import React from "react";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import GameFilterContainer from "@/components/molecules/Filter/GameFilterContainer";
import { UseGameFiltersReturn } from "@/hooks/useGameFilters";

interface GameFilterManagerProps {
  isFilterOpen: boolean;
  onFilterClose: () => void;
  gameFilters: UseGameFiltersReturn;
}

export const GameFilterManager: React.FC<GameFilterManagerProps> = ({
  isFilterOpen,
  onFilterClose,
  gameFilters,
}) => {
  return (
    <Drawer
      open={isFilterOpen}
      onClose={onFilterClose}
      title="Filtrar Jogos"
      anchor="right"
      className="w-full max-w-md"
    >
      <GameFilterContainer
        onGenreChange={gameFilters.handleGenreChange}
        onPlatformChange={gameFilters.handlePlatformChange}
        onFavoriteChange={gameFilters.handleFavoriteChange}
        selectedGenres={gameFilters.selectedGenres}
        selectedPlatforms={gameFilters.selectedPlatforms}
        showOnlyFavorites={gameFilters.showOnlyFavorites}
        clearFilters={gameFilters.clearFilters}
      />
    </Drawer>
  );
};
