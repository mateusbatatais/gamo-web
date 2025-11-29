// components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card } from "@/components/atoms/Card/Card";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { GridHeader } from "../GridHeader/GridHeader";
import { ConsoleFilterManager } from "../FilterManager/ConsoleFilterManager";
import { EmptyState } from "../EmptyState/EmptyState";
import { usePublicProfileCatalog } from "@/hooks/usePublicProfileCatalog";
import { useConsoleFilters } from "@/hooks/useConsoleFilters";
import { useConsoleData } from "../_hooks/useConsoleData";
import { useGridColumns } from "../_hooks/useGridColumns";
import { useCollapseManager } from "../_hooks/useCollapseManager";
import { ConsoleGridSection } from "../_sections/ConsoleGridSection";
import { AccessoriesStandaloneSection } from "../_sections/AccessoriesStandaloneSection";
import { GamesStandaloneSection } from "../_sections/GamesStandaloneSection";
import { ViewMode } from "@/@types/catalog-state.types";
import { Grid3X3, List, Table, ListChecks } from "lucide-react";
import { PublicConsoleDetailModal } from "../PublicConsoleDetailModal/PublicConsoleDetailModal";
import { PublicGameDetailModal } from "../PublicGameDetailModal/PublicGameDetailModal";
import { PublicAccessoryDetailModal } from "../PublicAccessoryDetailModal/PublicAccessoryDetailModal";

interface PublicProfileConsoleGridProps {
  slug: string;
  locale: string;
  isOwner?: boolean;
}

const queryClient = new QueryClient();

export const PublicProfileConsoleGrid = ({
  slug,
  locale,
  isOwner = false,
}: PublicProfileConsoleGridProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicProfileConsoleGridContent slug={slug} locale={locale} isOwner={isOwner} />
    </QueryClientProvider>
  );
};

const PublicProfileConsoleGridContent = ({
  slug,
  locale,
  isOwner,
}: PublicProfileConsoleGridProps) => {
  const t = useTranslations("PublicProfile");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Estado do catálogo principal
  const catalogState = usePublicProfileCatalog({
    storageKey: "userConsolesViewPreferences",
    defaultViewMode: "grid",
    defaultPerPage: 50,
    defaultSort: "name-asc",
  });

  // Estados para acessórios avulsos
  const [accessoriesPage, setAccessoriesPage] = useState(1);
  const [accessoriesPerPage, setAccessoriesPerPage] = useState(20);
  const [accessoriesSort, setAccessoriesSort] = useState("createdAt-desc");

  // Estados para jogos avulsos
  const [gamesPage, setGamesPage] = useState(1);
  const [gamesPerPage, setGamesPerPage] = useState(20);
  const [gamesSort, setGamesSort] = useState("title-asc");

  // Filtros de consoles
  const consoleFilters = useConsoleFilters();

  // Novos hooks
  const gridCols = useGridColumns("normal");
  const compactCols = useGridColumns("compact");
  const collapseManager = useCollapseManager();

  // Dados dos consoles, acessórios e jogos
  const consoleData = useConsoleData({
    slug,
    locale,
    status: "OWNED,PREVIOUSLY_OWNED",
    page: catalogState.page,
    perPage: catalogState.perPage,
    sort: catalogState.sort,
    searchQuery: catalogState.searchQuery,
    consoleFilters: {
      selectedBrands: consoleFilters.selectedBrands,
      selectedGenerations: consoleFilters.selectedGenerations,
      selectedModels: consoleFilters.selectedModels,
      selectedTypes: consoleFilters.selectedTypes,
      selectedMediaFormats: consoleFilters.selectedMediaFormats,
      selectedStorageRanges: consoleFilters.selectedStorageRanges,
      retroCompatible: consoleFilters.retroCompatible,
      selectedAllDigital: consoleFilters.selectedAllDigital,
      showOnlyFavorites: consoleFilters.showOnlyFavorites,
    },
    accessoriesPage,
    accessoriesPerPage,
    accessoriesSort,
    gamesPage,
    gamesPerPage,
    gamesSort,
  });

  const {
    consoles,
    accessories,
    games,
    consolesMeta,
    accessoriesMeta,
    gamesMeta,
    isLoading,
    error,
  } = consoleData;

  // Find console for modal from existing data
  const consoleIdParam = searchParams.get("console");
  const selectedConsole = consoleIdParam
    ? consoles.find((c) => c.id === parseInt(consoleIdParam))
    : null;

  // Find game for modal from existing data
  const gameIdParam = searchParams.get("game");
  const selectedGame = gameIdParam ? games.find((g) => g.id === parseInt(gameIdParam)) : null;

  // Find accessory for modal from existing data
  const accessoryIdParam = searchParams.get("accessory");
  const selectedAccessory = accessoryIdParam
    ? accessories.find((a) => a.id === parseInt(accessoryIdParam))
    : null;

  // Handle modal close
  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("console");
    params.delete("game");
    params.delete("accessory");
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // Configurações reutilizáveis
  const SORT_OPTIONS = [
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "createdAt-asc", label: t("order.createdAtAsc") },
    { value: "createdAt-desc", label: t("order.createdAtDesc") },
    { value: "price-asc", label: t("order.priceAsc") },
    { value: "price-desc", label: t("order.priceDesc") },
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

  // Handlers para acessórios avulsos
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

  // Handlers para jogos avulsos
  const handleGamesPageChange = (newPage: number) => {
    setGamesPage(newPage);
  };

  const handleGamesSortChange = (newSort: string) => {
    setGamesSort(newSort);
    setGamesPage(1);
  };

  const handleGamesPerPageChange = (newPerPage: number) => {
    setGamesPerPage(newPerPage);
    setGamesPage(1);
  };

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
        searchPath={`/user/${slug}`}
        searchPlaceholder={t("searchConsoles")}
        sortOptions={SORT_OPTIONS}
        sortValue={catalogState.sort}
        onSortChange={catalogState.setSort}
        perPageOptions={PER_PAGE_OPTIONS}
        perPageValue={catalogState.perPage.toString()}
        onPerPageChange={(value) => catalogState.setPerPage(Number(value))}
        totalItems={consolesMeta?.total}
        viewModeOptions={VIEW_MODE_OPTIONS}
        viewModeValue={catalogState.viewMode}
        onViewModeChange={catalogState.setViewMode}
        onFilterOpen={() => setIsFilterOpen(true)}
        showFilterButton={true}
      />

      {/* ✅ SEÇÃO DE CONSOLES */}
      <ConsoleGridSection
        consoles={consoles}
        consolesMeta={consolesMeta}
        isOwner={isOwner}
        viewMode={catalogState.viewMode}
        currentPage={catalogState.page}
        onPageChange={catalogState.setPage}
        collapseManager={collapseManager}
        gridCols={gridCols}
        compactCols={compactCols}
        locale={locale}
        userSlug={slug}
        title={t("txtConsoles")}
        emptyMessage={t("noConsoles")}
        addButtonText={t("txtAddConsole")}
        addButtonLink="/user/collection/consoles/add?type=collection"
      />

      {/* ✅ SEÇÃO DE ACESSÓRIOS AVULSOS */}
      <AccessoriesStandaloneSection
        accessories={accessories}
        accessoriesMeta={accessoriesMeta}
        isOwner={isOwner}
        viewMode={catalogState.viewMode}
        accessoriesPage={accessoriesPage}
        accessoriesPerPage={accessoriesPerPage}
        accessoriesSort={accessoriesSort}
        onAccessoriesPageChange={handleAccessoriesPageChange}
        onAccessoriesPerPageChange={handleAccessoriesPerPageChange}
        onAccessoriesSortChange={handleAccessoriesSortChange}
        sortOptions={SORT_OPTIONS}
        perPageOptions={PER_PAGE_OPTIONS}
        title="Acessórios Avulsos"
        emptyMessage="Nenhum acessório avulso encontrado"
        addButtonText={t("txtAddAccessory")}
        addButtonLink="/user/collection/accessories/add?type=collection"
      />

      {/* ✅ SEÇÃO DE JOGOS AVULSOS */}
      <GamesStandaloneSection
        games={games}
        gamesMeta={gamesMeta}
        isOwner={isOwner}
        viewMode={catalogState.viewMode}
        gamesPage={gamesPage}
        gamesPerPage={gamesPerPage}
        gamesSort={gamesSort}
        onGamesPageChange={handleGamesPageChange}
        onGamesPerPageChange={handleGamesPerPageChange}
        onGamesSortChange={handleGamesSortChange}
        sortOptions={SORT_OPTIONS}
        perPageOptions={PER_PAGE_OPTIONS}
        title="Jogos Avulsos"
        emptyMessage="Nenhum jogo avulso encontrado"
        addButtonText={t("txtAddGame")}
        addButtonLink="/user/collection/games/add?type=collection"
      />

      {/* ✅ ESTADO VAZIO GLOBAL (fallback) */}
      {consoles.length === 0 && accessories.length === 0 && games.length === 0 && !isOwner && (
        <EmptyState type="consoles" isOwner={isOwner} viewMode={catalogState.viewMode} />
      )}

      {/* ✅ GERENCIADOR DE FILTROS ESPECÍFICO */}
      <ConsoleFilterManager
        isFilterOpen={isFilterOpen}
        onFilterClose={() => setIsFilterOpen(false)}
        consoleFilters={consoleFilters}
      />

      {/* Console Detail Modal */}
      {selectedConsole && (
        <PublicConsoleDetailModal
          consoleItem={selectedConsole}
          isOpen={!!consoleIdParam}
          onClose={handleCloseModal}
        />
      )}

      {/* Game Detail Modal */}
      {selectedGame && (
        <PublicGameDetailModal
          gameItem={selectedGame}
          isOpen={!!gameIdParam}
          onClose={handleCloseModal}
        />
      )}

      {/* Accessory Detail Modal */}
      {selectedAccessory && (
        <PublicAccessoryDetailModal
          accessoryItem={selectedAccessory}
          isOpen={!!accessoryIdParam}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
