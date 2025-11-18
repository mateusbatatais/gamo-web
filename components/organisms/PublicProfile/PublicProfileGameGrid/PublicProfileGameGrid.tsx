// components/organisms/PublicProfile/PublicProfileGameGrid/PublicProfileGameGrid.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { GridHeader } from "../GridHeader/GridHeader";
import { GameFilterManager } from "../FilterManager/GameFilterManager";
import { EmptyState } from "../EmptyState/EmptyState";
import { usePublicProfileCatalog } from "@/hooks/usePublicProfileCatalog";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useGameData } from "../_hooks/useGameData";
import { GameGridSection } from "../_sections/GameGridSection";
import { ViewMode } from "@/@types/catalog-state.types";
import { Grid3X3, List, Table, ListChecks } from "lucide-react";

interface PublicProfileGameGridProps {
  slug: string;
  locale: string;
  isOwner?: boolean;
}

const queryClient = new QueryClient();

export const PublicProfileGameGrid = ({
  slug,
  locale,
  isOwner = false,
}: PublicProfileGameGridProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicProfileGameGridContent slug={slug} locale={locale} isOwner={isOwner} />
    </QueryClientProvider>
  );
};

const PublicProfileGameGridContent = ({ slug, locale, isOwner }: PublicProfileGameGridProps) => {
  const t = useTranslations("PublicProfile");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Estado do catálogo
  const catalogState = usePublicProfileCatalog({
    storageKey: "userGamesViewPreferences",
    defaultViewMode: "grid",
    defaultPerPage: 50,
    defaultSort: "title-asc",
  });

  // Filtros de games (AGORA INCLUI FAVORITOS)
  const gameFilters = useGameFilters();

  // Dados dos jogos
  const { games, gamesMeta, isLoading, error } = useGameData({
    slug,
    locale,
    status: "OWNED",
    page: catalogState.page,
    perPage: catalogState.perPage,
    sort: catalogState.sort,
    searchQuery: catalogState.searchQuery,
    gameFilters: {
      selectedGenres: gameFilters.selectedGenres,
      selectedPlatforms: gameFilters.selectedPlatforms,
      showOnlyFavorites: gameFilters.showOnlyFavorites,
    },
  });

  // Configurações reutilizáveis
  const SORT_OPTIONS = [
    { value: "title-asc", label: t("order.titleAsc") },
    { value: "title-desc", label: t("order.titleDesc") },
    { value: "createdAt-asc", label: t("order.createdAtAsc") },
    { value: "createdAt-desc", label: t("order.createdAtDesc") },
    { value: "progress-asc", label: t("order.progressAsc") },
    { value: "progress-desc", label: t("order.progressDesc") },
    { value: "rating-asc", label: t("order.ratingAsc") },
    { value: "rating-desc", label: t("order.ratingDesc") },
  ];

  const PER_PAGE_OPTIONS = [
    { value: "20", label: "20/pg" },
    { value: "50", label: "50/pg" },
    { value: "100", label: "100/pg" },
  ];

  const VIEW_MODE_OPTIONS: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
    { value: "grid", label: t("viewMode.grid"), icon: <Grid3X3 size={16} /> },
    { value: "compact", label: t("viewMode.compact"), icon: <ListChecks size={16} /> },
    { value: "list", label: t("viewMode.list"), icon: <List size={16} /> },
    { value: "table", label: t("viewMode.table"), icon: <Table size={16} /> },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t("errorLoading")}</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* ✅ HEADER UNIFICADO */}
      <GridHeader
        searchPath={`/user/${slug}/games`}
        searchPlaceholder={t("searchGames")}
        sortOptions={SORT_OPTIONS}
        sortValue={catalogState.sort}
        onSortChange={catalogState.setSort}
        perPageOptions={PER_PAGE_OPTIONS}
        perPageValue={catalogState.perPage.toString()}
        onPerPageChange={(value) => catalogState.setPerPage(Number(value))}
        viewModeOptions={VIEW_MODE_OPTIONS}
        viewModeValue={catalogState.viewMode}
        onViewModeChange={catalogState.setViewMode}
        onFilterOpen={() => setIsFilterOpen(true)}
        showFilterButton={true}
      />

      {/* ✅ SEÇÃO DE JOGOS */}
      <GameGridSection
        games={games}
        gamesMeta={gamesMeta}
        isOwner={isOwner}
        viewMode={catalogState.viewMode}
        currentPage={catalogState.page}
        onPageChange={catalogState.setPage}
        title={t("gamesCollection")}
        emptyMessage={t("noGames")}
        addButtonText={t("txtAddGame")}
        addButtonLink="/user/collection/games/add/"
      />

      {/* ✅ ESTADO VAZIO GLOBAL (fallback) */}
      {games.length === 0 && !isOwner && (
        <EmptyState type="games" isOwner={isOwner} viewMode={catalogState.viewMode} />
      )}

      {/* ✅ GERENCIADOR DE FILTROS ESPECÍFICO (AGORA COM FAVORITOS) */}
      <GameFilterManager
        isFilterOpen={isFilterOpen}
        onFilterClose={() => setIsFilterOpen(false)}
        gameFilters={gameFilters}
      />
    </div>
  );
};
