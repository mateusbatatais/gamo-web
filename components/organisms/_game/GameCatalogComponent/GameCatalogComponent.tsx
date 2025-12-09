// components/organisms/GameCatalogComponent/GameCatalogComponent.tsx
"use client";

import { useTranslations } from "next-intl";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useGames } from "@/hooks/useGames";
import { Game } from "@/@types/catalog.types";
import { useCatalogState } from "@/hooks/useCatalogState";
import { useGameFilters } from "@/hooks/useGameFilters";
import GameFilterContainer from "@/components/molecules/Filter/GameFilterContainer";
import GameCard from "@/components/molecules/_game/GameCard/GameCard";
import { useEffect } from "react";
import { CatalogSkeleton } from "../../Catalog/CatalogSkeleton";
import { CatalogEmptyState } from "../../Catalog/CatalogEmptyState";
import { CatalogLayout } from "../../Catalog/Layouts/CatalogLayout";

interface GameCatalogComponentProps {
  perPage: number;
}

const GameCatalogComponent = ({ perPage }: GameCatalogComponentProps) => {
  const t = useTranslations();
  const { setItems } = useBreadcrumbs();

  // Estado do catálogo
  const catalogState = useCatalogState({
    storageKey: "game-catalog",
    defaultViewMode: "grid",
    defaultSort: "score-desc",
    defaultPerPage: perPage,
  });

  // Filtros específicos de games
  const gameFilters = useGameFilters();

  // Buscar dados
  const {
    data: games,
    isLoading,
    error,
    isPlaceholderData,
  } = useGames({
    page: catalogState.page,
    perPage: catalogState.perPage,
    sort: catalogState.sort,
    selectedGenres: gameFilters.selectedGenres,
    selectedPlatforms: gameFilters.selectedPlatforms,
    searchQuery: catalogState.searchQuery,
  });

  // Opções de ordenação
  const SORT_OPTIONS = [
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "releaseDate-asc", label: t("order.releaseDateAsc") },
    { value: "releaseDate-desc", label: t("order.releaseDateDesc") },
    { value: "score-desc", label: t("order.scoreDesc") },
  ];

  // Breadcrumbs
  useEffect(() => {
    setItems([
      {
        label: t("Breadcrumbs.game-catalog"),
      },
    ]);

    return () => setItems([]);
  }, [setItems, t]);

  // Loading state
  if (isLoading && !isPlaceholderData) {
    return <CatalogSkeleton itemCount={6} />;
  }

  // Error state
  if (error) {
    return (
      <CatalogEmptyState
        title="Erro ao carregar dados"
        description={error.message}
        actionText="Tentar novamente"
        onClearFilters={() => window.location.reload()}
      />
    );
  }

  // Conteúdo principal
  const renderContent = () => {
    if (!games?.items || games.items.length === 0) {
      return (
        <CatalogEmptyState
          title="Nenhum jogo encontrado"
          description="Tente ajustar sua busca ou filtros"
          onClearFilters={gameFilters.clearFilters}
        />
      );
    }

    return (
      <div className="relative">
        {/* Loading overlay quando filtros são aplicados */}
        {isPlaceholderData && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Aplicando filtros...
              </p>
            </div>
          </div>
        )}

        <div
          className={
            catalogState.viewMode === "grid"
              ? "grid grid-cols-2 xl:grid-cols-3 gap-6"
              : "flex flex-col space-y-6"
          }
        >
          {games.items.map((game: Game) => (
            <GameCard
              key={game.id}
              id={game.id}
              name={game.name}
              imageUrl={game.imageUrl || ""}
              parentPlatforms={game.parentPlatforms}
              platforms={game.platforms}
              slug={game.slug}
              releaseDate={game.releaseDate || ""}
              metacritic={game.metacritic}
              developer={game.developer}
              orientation={catalogState.viewMode === "grid" ? "vertical" : "horizontal"}
              shortScreenshots={game.shortScreenshots}
              isFavorite={game.isFavorite}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <CatalogLayout
      // Header
      searchPlaceholder="Buscar jogos..."
      searchPath="/game-catalog"
      sortOptions={SORT_OPTIONS}
      // Filtros
      filterSidebar={
        <GameFilterContainer
          onGenreChange={gameFilters.handleGenreChange}
          onPlatformChange={gameFilters.handlePlatformChange}
          selectedGenres={gameFilters.selectedGenres}
          selectedPlatforms={gameFilters.selectedPlatforms}
          clearFilters={gameFilters.clearFilters}
        />
      }
      filterDrawer={
        <GameFilterContainer
          onGenreChange={gameFilters.handleGenreChange}
          onPlatformChange={gameFilters.handlePlatformChange}
          selectedGenres={gameFilters.selectedGenres}
          selectedPlatforms={gameFilters.selectedPlatforms}
          clearFilters={gameFilters.clearFilters}
        />
      }
      // Conteúdo
      content={renderContent()}
      emptyState={null} // Já tratamos no renderContent
      loadingState={null} // Já tratamos acima
      // Paginação
      pagination={
        games?.meta
          ? {
              currentPage: catalogState.page,
              totalPages: games.meta.totalPages,
              onPageChange: catalogState.setPage,
            }
          : undefined
      }
      // Estados
      viewMode={catalogState.viewMode}
      onViewModeChange={catalogState.setViewMode}
      sort={catalogState.sort}
      onSortChange={catalogState.setSort}
      isFilterDrawerOpen={catalogState.isFilterDrawerOpen}
      onFilterDrawerToggle={catalogState.setFilterDrawerOpen}
    />
  );
};

export default GameCatalogComponent;
