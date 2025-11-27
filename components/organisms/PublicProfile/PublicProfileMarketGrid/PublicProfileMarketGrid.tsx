// components/organisms/PublicProfile/PublicProfileMarketGrid/PublicProfileMarketGrid.tsx - VERSÃO FINAL
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { GridHeader } from "../GridHeader/GridHeader";
import { FilterManager } from "../FilterManager/FilterManager";
import { EmptyState } from "../EmptyState/EmptyState";
import { usePublicProfileCatalog } from "@/hooks/usePublicProfileCatalog";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useConsoleFilters } from "@/hooks/useConsoleFilters";
import { useAccessoryFilters } from "@/hooks/useAccessoryFilters";
import { useGridColumns } from "../_hooks/useGridColumns";
import { useCollapseManager } from "../_hooks/useCollapseManager";
import { useMarketData } from "../_hooks/useMarketData";
import { ConsolesSection } from "../_sections/ConsolesSection";
import { GamesSection } from "../_sections/GamesSection";
import { AccessoriesSection } from "../_sections/AccessoriesSection";
import { ViewMode } from "@/@types/catalog-state.types";
import { Grid3X3, List, Table, ListChecks } from "lucide-react";

interface PublicProfileMarketGridProps {
  slug: string;
  locale: string;
  isOwner?: boolean;
}

const queryClient = new QueryClient();

export const PublicProfileMarketGrid = ({
  slug,
  locale,
  isOwner = false,
}: PublicProfileMarketGridProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicProfileMarketGridContent slug={slug} locale={locale} isOwner={isOwner} />
    </QueryClientProvider>
  );
};

const PublicProfileMarketGridContent = ({
  slug,
  locale,
  isOwner,
}: PublicProfileMarketGridProps) => {
  const t = useTranslations("PublicProfile");
  const [isGameFilterOpen, setIsGameFilterOpen] = useState(false);
  const [isConsoleFilterOpen, setIsConsoleFilterOpen] = useState(false);
  const [isAccessoryFilterOpen, setIsAccessoryFilterOpen] = useState(false);

  // Estado do catálogo principal
  const catalogState = usePublicProfileCatalog({
    storageKey: "userMarketViewPreferences",
    defaultViewMode: "grid",
    defaultPerPage: 50,
    defaultSort: "createdAt-desc",
  });

  // Novos hooks
  const gridCols = useGridColumns("normal");
  const compactCols = useGridColumns("compact");
  const collapseManager = useCollapseManager();

  // Estados para acessórios avulsos
  const [accessoriesPage, setAccessoriesPage] = useState(1);
  const [accessoriesPerPage, setAccessoriesPerPage] = useState(20);
  const [accessoriesSort, setAccessoriesSort] = useState("createdAt-desc");

  // Filtros
  const gameFilters = useGameFilters();
  const consoleFilters = useConsoleFilters();
  const accessoryFilters = useAccessoryFilters();

  // Determinar o status
  const type = catalogState.searchParams?.get("tradetype") || "selling";
  const status = type === "looking" ? "LOOKING_FOR" : "SELLING";

  // Dados do mercado
  const marketData = useMarketData({
    slug,
    locale,
    status,
    page: catalogState.page,
    perPage: catalogState.perPage,
    sort: catalogState.sort,
    searchQuery: catalogState.searchQuery,
    gameFilters: {
      selectedGenres: gameFilters.selectedGenres,
      selectedPlatforms: gameFilters.selectedPlatforms,
    },
    consoleFilters: {
      selectedBrands: consoleFilters.selectedBrands,
      selectedGenerations: consoleFilters.selectedGenerations,
      selectedModels: consoleFilters.selectedModels,
      selectedTypes: consoleFilters.selectedTypes,
      selectedMediaFormats: consoleFilters.selectedMediaFormats,
      selectedStorageRanges: consoleFilters.selectedStorageRanges,
      retroCompatible: consoleFilters.retroCompatible,
      selectedAllDigital: consoleFilters.selectedAllDigital,
    },
    accessoryFilters: {
      selectedTypes: accessoryFilters.selectedTypes,
      selectedSubTypes: accessoryFilters.selectedSubTypes,
      selectedConsoles: accessoryFilters.selectedConsoles,
    },
    accessoriesPage,
    accessoriesPerPage,
    accessoriesSort,
  });

  const {
    games,
    consoles,
    accessories,
    gamesMeta,
    consolesMeta,
    accessoriesMeta,
    isLoading,
    error,
  } = marketData;

  // Configurações reutilizáveis
  const toggleItems = [
    { value: "selling", label: t("selling") },
    { value: "looking", label: t("lookingFor") },
  ];

  const SORT_OPTIONS = [
    { value: "createdAt-desc", label: t("order.createdAtDesc") },
    { value: "createdAt-asc", label: t("order.createdAtAsc") },
    { value: "price-desc", label: t("order.priceDesc") },
    { value: "price-asc", label: t("order.priceAsc") },
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

  // Handlers
  const handleAccessoriesPageChange = (newPage: number) => {
    setAccessoriesPage(newPage);
  };

  const handleAccessoriesSortChange = (newSort: string) => {
    setAccessoriesSort(newSort);
    setAccessoriesPage(1);
  };

  const handleAccessoriesPerPageChange = (newPerPage: number) => {
    setAccessoriesPerPage(newPerPage);
    setAccessoriesPage(1);
  };

  const handleTypeChange = (newType: string) => {
    catalogState.updateURL({ tradetype: newType, page: "1" });
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
        searchPath={`/user/${slug}/market`}
        searchPlaceholder={t("searchMarket")}
        toggleItems={toggleItems}
        toggleValue={type}
        onToggleChange={handleTypeChange}
        sortOptions={SORT_OPTIONS}
        sortValue={catalogState.sort}
        onSortChange={catalogState.setSort}
        perPageOptions={PER_PAGE_OPTIONS}
        perPageValue={catalogState.perPage.toString()}
        onPerPageChange={(value) => catalogState.setPerPage(Number(value))}
        totalItems={
          (gamesMeta?.total || 0) + (consolesMeta?.total || 0) + (accessoriesMeta?.total || 0)
        }
        viewModeOptions={VIEW_MODE_OPTIONS}
        viewModeValue={catalogState.viewMode}
        onViewModeChange={catalogState.setViewMode}
        showFilterButton={false} // Filtros estão nas seções individuais
      />

      {/* ✅ SEÇÕES ESPECIALIZADAS */}
      <ConsolesSection
        consoles={consoles}
        consolesMeta={consolesMeta}
        isOwner={isOwner}
        type={type}
        viewMode={catalogState.viewMode}
        currentPage={catalogState.page}
        onPageChange={catalogState.setPage}
        collapseManager={collapseManager}
        gridCols={gridCols}
        compactCols={compactCols}
        onFilterOpen={() => setIsConsoleFilterOpen(true)}
        locale={locale}
      />

      <GamesSection
        games={games}
        gamesMeta={gamesMeta}
        isOwner={isOwner}
        type={type}
        viewMode={catalogState.viewMode}
        currentPage={catalogState.page}
        onPageChange={catalogState.setPage}
        onFilterOpen={() => setIsGameFilterOpen(true)}
      />

      <AccessoriesSection
        accessories={accessories}
        accessoriesMeta={accessoriesMeta}
        isOwner={isOwner}
        type={type}
        viewMode={catalogState.viewMode}
        accessoriesPage={accessoriesPage}
        accessoriesPerPage={accessoriesPerPage}
        accessoriesSort={accessoriesSort}
        onAccessoriesPageChange={handleAccessoriesPageChange}
        onAccessoriesPerPageChange={handleAccessoriesPerPageChange}
        onAccessoriesSortChange={handleAccessoriesSortChange}
        onFilterOpen={() => setIsAccessoryFilterOpen(true)}
        sortOptions={SORT_OPTIONS}
        perPageOptions={PER_PAGE_OPTIONS}
      />

      {/* ✅ ESTADO VAZIO GLOBAL */}
      {games.length === 0 && consoles.length === 0 && accessories.length === 0 && !isOwner && (
        <EmptyState type="global" marketType={type as "selling" | "looking"} isOwner={isOwner} />
      )}

      {/* ✅ GERENCIADOR DE FILTROS UNIFICADO */}
      <FilterManager
        isGameFilterOpen={isGameFilterOpen}
        isConsoleFilterOpen={isConsoleFilterOpen}
        isAccessoryFilterOpen={isAccessoryFilterOpen}
        onGameFilterClose={() => setIsGameFilterOpen(false)}
        onConsoleFilterClose={() => setIsConsoleFilterOpen(false)}
        onAccessoryFilterClose={() => setIsAccessoryFilterOpen(false)}
        gameFilters={gameFilters}
        consoleFilters={consoleFilters}
        accessoryFilters={accessoryFilters}
        locale={locale}
      />
    </div>
  );
};
