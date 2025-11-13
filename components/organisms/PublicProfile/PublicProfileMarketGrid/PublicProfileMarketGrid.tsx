// components/organisms/PublicProfile/PublicProfileMarketGrid/PublicProfileMarketGrid.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { PublicProfileGameList } from "../PublicProfileGameCard/PublicProfileGameList";
import { PublicProfileGameTable } from "../PublicProfileGameCard/PublicProfileGameTable";
import { PublicProfileGameCompact } from "../PublicProfileGameCard/PublicProfileGameCompact";
import { PublicProfileConsoleList } from "../PublicProfileConsoleCard/PublicProfileConsoleList";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";
import { PublicProfileConsoleCompact } from "../PublicProfileConsoleCard/PublicProfileConsoleCompact";
import { PublicProfileConsoleTable } from "../PublicProfileConsoleCard/PublicProfileConsoleTable";
import {
  useUserGamesPublic,
  useUserConsolesPublic,
  useUserAccessoriesPublic,
} from "@/hooks/usePublicProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { UserConsole } from "@/@types/collection.types";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { ToggleGroup } from "@/components/molecules/ToggleGroup/ToggleGroup";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { Grid3X3, List, Table, ListChecks, Settings2 } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { Select } from "@/components/atoms/Select/Select";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import GameFilterContainer from "@/components/molecules/Filter/GameFilterContainer";
import ConsoleFilterContainer from "@/components/molecules/Filter/ConsoleFilterContainer";
import AccessoryFilterContainer from "@/components/molecules/Filter/AccessoryFilterContainer";
import { AccessoryTableRow } from "../AccessoryCard/AccessoryTableRow";
import { AccessoryListItem } from "../AccessoryCard/AccessoryListItem";
import { AccessoryCompactCard } from "../AccessoryCard/AccessoryCompactCard";
import { AccessoryCard } from "../AccessoryCard/AccessoryCard";
import { EmptyCard } from "../EmptyCard/EmptyCard";
import { usePublicProfileCatalog } from "@/hooks/usePublicProfileCatalog";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useConsoleFilters } from "@/hooks/useConsoleFilters";
import { useAccessoryFilters } from "@/hooks/useAccessoryFilters";
import { ViewMode } from "@/@types/catalog-state.types";
import {
  ConsoleAccessories,
  ConsoleAccessoriesCompact,
  ConsoleAccessoriesList,
  ConsoleAccessoriesTable,
} from "../PublicProfileConsoleGrid/ConsoleAccessories";

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

// Hooks de colunas responsivas
function useResponsiveColumns(): number {
  const [cols, setCols] = useState<number>(2);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCols(4);
      else if (w >= 768) setCols(3);
      else setCols(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

function useCompactColumns(): number {
  const [cols, setCols] = useState<number>(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1536) setCols(8);
      else if (w >= 1024) setCols(6);
      else if (w >= 768) setCols(4);
      else setCols(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

// Checagem leve para existência de acessórios
const consoleHasAccessories = (item: UserConsole) =>
  Array.isArray(item.accessories) && item.accessories.length > 0;

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

  // Estados para colapse de acessórios em consoles
  const [openGridId, setOpenGridId] = useState<number | null>(null);
  const [openGridRowStart, setOpenGridRowStart] = useState<number | null>(null);
  const [openCompactId, setOpenCompactId] = useState<number | null>(null);
  const [openCompactRowStart, setOpenCompactRowStart] = useState<number | null>(null);
  const [openListId, setOpenListId] = useState<number | null>(null);
  const [openTableId, setOpenTableId] = useState<number | null>(null);

  const gridCols = useResponsiveColumns();
  const compactCols = useCompactColumns();

  // Estado para acessórios avulsos
  const [accessoriesPage, setAccessoriesPage] = useState(1);
  const [accessoriesPerPage, setAccessoriesPerPage] = useState(20);
  const [accessoriesSort, setAccessoriesSort] = useState("createdAt-desc");

  // Filtros
  const gameFilters = useGameFilters();
  const consoleFilters = useConsoleFilters();
  const accessoryFilters = useAccessoryFilters();

  // Determinar o status baseado no tipo selecionado
  const type = catalogState.searchParams?.get("type") || "selling";
  const status = type === "looking" ? "LOOKING_FOR" : "SELLING";

  // Buscar itens baseado no tipo selecionado
  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,
  } = useUserGamesPublic(
    slug,
    locale,
    status,
    catalogState.page,
    catalogState.perPage,
    catalogState.sort,
    catalogState.searchQuery,
    gameFilters.selectedGenres,
    gameFilters.selectedPlatforms,
  );

  const {
    data: consolesData,
    isLoading: consolesLoading,
    error: consolesError,
  } = useUserConsolesPublic(
    slug,
    locale,
    status,
    catalogState.page,
    catalogState.perPage,
    catalogState.sort,
    catalogState.searchQuery,
    consoleFilters.selectedBrands.join(","),
    consoleFilters.selectedGenerations.join(","),
    consoleFilters.selectedModels.join(","),
    consoleFilters.selectedTypes.join(","),
    consoleFilters.selectedMediaFormats.join(","),
    consoleFilters.selectedStorageRanges.join(","),
    consoleFilters.retroCompatible,
    consoleFilters.selectedAllDigital,
    status,
  );

  const {
    data: accessoriesData,
    isLoading: accessoriesLoading,
    error: accessoriesError,
  } = useUserAccessoriesPublic(
    slug,
    accessoriesPage,
    accessoriesPerPage,
    accessoriesSort,
    status,
    accessoryFilters.selectedTypes.join(","),
    accessoryFilters.selectedSubTypes.join(","),
    accessoryFilters.selectedConsoles.join(","),
  );

  const isLoading = gamesLoading || consolesLoading || accessoriesLoading;
  const error = gamesError || consolesError || accessoriesError;

  const games = gamesData?.items || [];
  const consoles = consolesData?.items || [];
  const accessories = accessoriesData?.items || [];
  const gamesMeta = gamesData?.meta;
  const consolesMeta = consolesData?.meta;
  const accessoriesMeta = accessoriesData?.meta;

  const toggleItems = [
    { value: "selling", label: t("selling") },
    { value: "looking", label: t("lookingFor") },
  ];

  // Opções de ordenação compatíveis com ambas as APIs
  const SORT_OPTIONS: SortOption[] = [
    { value: "createdAt-desc", label: t("order.createdAtDesc") },
    { value: "createdAt-asc", label: t("order.createdAtAsc") },
    { value: "price-desc", label: t("order.priceDesc") },
    { value: "price-asc", label: t("order.priceAsc") },
  ];

  // Opções de itens por página
  const PER_PAGE_OPTIONS = [
    { value: "20", label: "20/pg" },
    { value: "50", label: "50/pg" },
    { value: "100", label: "100/pg" },
  ];

  // Opções de modo de visualização
  const VIEW_MODE_OPTIONS = [
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

  // Handlers para tipo (selling/looking)
  const handleTypeChange = (newType: string) => {
    catalogState.updateURL({ type: newType, page: "1" });
  };

  // Funções para colapse de acessórios
  const handleToggleGrid = (gridIndex: number, id: number) => {
    const rowStart = gridIndex - (gridIndex % gridCols);
    if (openGridId === id) {
      setOpenGridId(null);
      setOpenGridRowStart(null);
      return;
    }
    if (openGridRowStart !== null && rowStart === openGridRowStart) {
      setOpenGridId(id);
      return;
    }
    setOpenGridId(id);
    setOpenGridRowStart(rowStart);
  };

  const handleToggleCompact = (gridIndex: number, id: number) => {
    const rowStart = gridIndex - (gridIndex % compactCols);
    if (openCompactId === id) {
      setOpenCompactId(null);
      setOpenCompactRowStart(null);
      return;
    }
    if (openCompactRowStart !== null && rowStart === openCompactRowStart) {
      setOpenCompactId(id);
      return;
    }
    setOpenCompactId(id);
    setOpenCompactRowStart(rowStart);
  };

  const handleToggleList = (id: number) => {
    setOpenListId((prev) => (prev === id ? null : id));
  };

  const handleToggleTable = (id: number) => {
    setOpenTableId((prev) => (prev === id ? null : id));
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
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="w-full lg:flex-1">
          <SearchBar compact searchPath={`/user/${slug}/market`} placeholder={t("searchMarket")} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="w-full md:w-full lg:w-auto">
            <ToggleGroup
              items={toggleItems}
              value={type}
              onChange={handleTypeChange}
              variant="secondary"
              size="sm"
              className="w-full lg:w-auto"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-start lg:justify-end">
            <SortSelect
              options={SORT_OPTIONS}
              value={catalogState.sort}
              onChange={catalogState.setSort}
              className="w-full lg:w-auto min-w-50"
            />
            <Select
              options={PER_PAGE_OPTIONS}
              value={catalogState.perPage.toString()}
              onChange={(e) => catalogState.setPerPage(Number(e.target.value))}
              className="min-w-25"
              size="sm"
            />
            <Dropdown
              items={VIEW_MODE_OPTIONS.map((option) => ({
                id: option.value,
                label: option.label,
                icon: option.icon,
                onClick: () => catalogState.setViewMode(option.value as ViewMode),
              }))}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  icon={
                    VIEW_MODE_OPTIONS.find((option) => option.value === catalogState.viewMode)?.icon
                  }
                />
              }
              menuClassName="min-w-40"
            />
          </div>
        </div>
      </div>

      {/* Seção de Consoles */}
      {(consoles.length > 0 || isOwner) && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              {type === "selling" ? t("consolesForSale") : t("consolesLookingFor")}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConsoleFilterOpen(true)}
              icon={<Settings2 size={16} />}
            />
          </div>

          {/* Drawer de Filtros para Consoles */}
          <Drawer
            open={isConsoleFilterOpen}
            onClose={() => setIsConsoleFilterOpen(false)}
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

          {catalogState.viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-2 w-10" />
                    <th className="p-2 text-left">Console</th>
                    <th className="p-2 text-left">Skin</th>
                    <th className="p-2 text-left">Preço</th>
                    <th className="p-2 text-left">Condição</th>
                    <th className="p-2 text-left">Aceita Troca</th>
                    {isOwner && <th className="p-2 text-left">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {isOwner && (
                    <tr>
                      <td colSpan={6 + (isOwner ? 1 : 0)}>
                        <EmptyCard
                          text={t("txtConsole")}
                          buttonLabel={
                            type === "selling" ? t("txtSellConsole") : t("txtLookForConsole")
                          }
                          buttonLink="/user/collection/consoles/add/"
                          viewMode="table"
                          space={false}
                        />
                      </td>
                    </tr>
                  )}
                  {consoles.map((consoleItem: UserConsole) => {
                    const isExpanded = openTableId === consoleItem.id;
                    const canExpand = consoleHasAccessories(consoleItem);
                    return (
                      <React.Fragment key={consoleItem.id}>
                        <PublicProfileConsoleTable
                          type="trade"
                          consoleItem={consoleItem}
                          isOwner={isOwner}
                          isMarketGrid={true}
                          isExpanded={isExpanded}
                          onToggleAccessories={
                            canExpand
                              ? () => handleToggleTable(consoleItem.id as number)
                              : undefined
                          }
                        />
                        {isExpanded && (
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            <td colSpan={6 + (isOwner ? 1 : 0)} className="p-4">
                              <ConsoleAccessoriesTable
                                item={consoleItem}
                                isOwner={isOwner}
                                sale={true}
                                locale={locale}
                              />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : catalogState.viewMode === "list" ? (
            <div className="space-y-4">
              {isOwner && (
                <EmptyCard
                  text={t("txtConsole")}
                  buttonLabel={type === "selling" ? t("txtSellConsole") : t("txtLookForConsole")}
                  buttonLink="/user/collection/consoles/add/"
                  viewMode="list"
                />
              )}
              {consoles.map((consoleItem: UserConsole) => {
                const isOpen = openListId === consoleItem.id;
                return (
                  <div key={consoleItem.id} className="flex flex-col gap-2">
                    <PublicProfileConsoleList
                      type="trade"
                      consoleItem={consoleItem}
                      isOwner={isOwner}
                      isExpanded={isOpen}
                      onToggleAccessories={() => handleToggleList(consoleItem.id as number)}
                    />
                    {isOpen && (
                      <div>
                        <ConsoleAccessoriesList
                          item={consoleItem}
                          isOwner={isOwner}
                          sale={true}
                        />{" "}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : catalogState.viewMode === "compact" ? (
            <div className="flex flex-wrap gap-3">
              {isOwner && (
                <div
                  className="
                    box-border min-w-0 flex flex-col
                    flex-[0_0_calc(33.333%_-_.5rem)]
                    md:flex-[0_0_calc(25%_-_.5625rem)]
                    lg:flex-[0_0_calc(16.666%_-_.625rem)]
                    xl:flex-[0_0_calc(12.5%_-_.65625rem)]
                  "
                >
                  <EmptyCard
                    text={t("txtConsole")}
                    buttonLabel={type === "selling" ? t("txtSellConsole") : t("txtLookForConsole")}
                    buttonLink="/user/collection/consoles/add/"
                    viewMode="compact"
                  />
                </div>
              )}
              {consoles.map((consoleItem: UserConsole, index: number) => {
                const isOpen = openCompactId === consoleItem.id;

                const gridIndex = isOwner ? index + 1 : index;
                const rowStart = gridIndex - (gridIndex % compactCols);
                const rowEndIndex = rowStart + (compactCols - 1);
                const isRowEnd =
                  gridIndex === rowEndIndex ||
                  gridIndex === (isOwner ? consoles.length : consoles.length - 1);

                const shouldRenderAccessoriesRow =
                  openCompactRowStart !== null &&
                  isRowEnd &&
                  gridIndex >= openCompactRowStart &&
                  gridIndex < openCompactRowStart + compactCols;

                return (
                  <div key={consoleItem.id} className="contents">
                    <div
                      className="
                        box-border min-w-0 flex flex-col
                        flex-[0_0_calc(33.333%_-_.5rem)]
                        md:flex-[0_0_calc(25%_-_.5625rem)]
                        lg:flex-[0_0_calc(16.666%_-_.625rem)]
                        xl:flex-[0_0_calc(12.5%_-_.65625rem)]
                      "
                    >
                      <PublicProfileConsoleCompact
                        type="trade"
                        consoleItem={consoleItem}
                        isOwner={isOwner}
                        isExpanded={isOpen}
                        onToggleAccessories={() =>
                          handleToggleCompact(gridIndex, consoleItem.id as number)
                        } // ← Passar gridIndex
                      />
                    </div>

                    {shouldRenderAccessoriesRow && (
                      <div className="basis-full">
                        <ConsoleAccessoriesCompact
                          item={consoles.find((c) => c.id === openCompactId)}
                          isOwner={isOwner}
                          sale={true}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {isOwner && (
                <div
                  className="
                    box-border min-w-0
                    flex-[0_0_calc(50%_-_.75rem)]
                    md:flex-[0_0_calc(33.333%_-_1rem)]
                    lg:flex-[0_0_calc(25%_-_1.125rem)]
                    flex flex-col
                  "
                >
                  <EmptyCard
                    text={t("txtConsole")}
                    buttonLabel={type === "selling" ? t("txtSellConsole") : t("txtLookForConsole")}
                    buttonLink="/user/collection/consoles/add/"
                    viewMode="card"
                  />
                </div>
              )}
              {consoles.map((consoleItem: UserConsole, index: number) => {
                const isOpen = openGridId === consoleItem.id;

                // CORREÇÃO: Usar gridIndex ajustado como no ConsoleGrid
                const gridIndex = isOwner ? index + 1 : index;
                const rowStart = gridIndex - (gridIndex % gridCols);
                const rowEndIndex = rowStart + (gridCols - 1);
                const isRowEnd =
                  gridIndex === rowEndIndex ||
                  gridIndex === (isOwner ? consoles.length : consoles.length - 1);

                const shouldRenderAccessoriesRow =
                  openGridRowStart !== null &&
                  isRowEnd &&
                  gridIndex >= openGridRowStart &&
                  gridIndex < openGridRowStart + gridCols;

                return (
                  <div key={consoleItem.id} className="contents">
                    <div
                      className="
                        box-border min-w-0
                        flex-[0_0_calc(50%_-_.75rem)]
                        md:flex-[0_0_calc(33.333%_-_1rem)]
                        lg:flex-[0_0_calc(25%_-_1.125rem)]
                        flex flex-col
                      "
                    >
                      <PublicProfileConsoleCard
                        type="trade"
                        consoleItem={consoleItem}
                        isOwner={isOwner}
                        isExpanded={isOpen}
                        onToggleAccessories={() =>
                          handleToggleGrid(gridIndex, consoleItem.id as number)
                        } // ← Passar gridIndex
                      />
                    </div>

                    {shouldRenderAccessoriesRow && (
                      <div className="basis-full">
                        <ConsoleAccessories
                          item={consoles.find((c) => c.id === openGridId)}
                          isOwner={isOwner}
                          sale={true}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {consolesMeta && consolesMeta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={catalogState.page}
                totalPages={consolesMeta.totalPages}
                onPageChange={catalogState.setPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Seção de Jogos */}
      {(games.length > 0 || isOwner) && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              {type === "selling" ? t("gamesForSale") : t("gamesLookingFor")}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGameFilterOpen(true)}
              icon={<Settings2 size={16} />}
            />
          </div>

          {/* Drawer de Filtros para Jogos */}
          <Drawer
            open={isGameFilterOpen}
            onClose={() => setIsGameFilterOpen(false)}
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

          {catalogState.viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-2 text-left">Jogo</th>
                    <th className="p-2 text-left">Plataforma</th>
                    <th className="p-2 text-left">Preço</th>
                    <th className="p-2 text-left">Condição</th>
                    <th className="p-2 text-left">Aceita Troca</th>
                    <th className="p-2 text-left">Mídia</th>
                    {isOwner && <th className="p-2 text-left">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {isOwner && (
                    <tr>
                      <td colSpan={6 + (isOwner ? 1 : 0)}>
                        <EmptyCard
                          text={t("txtGame")}
                          buttonLabel={type === "selling" ? t("txtSellGame") : t("txtLookForGame")}
                          buttonLink="/user/collection/games/add/"
                          viewMode="table"
                          space={false}
                        />
                      </td>
                    </tr>
                  )}
                  {games.map((game) => (
                    <PublicProfileGameTable
                      type="trade"
                      key={`game-${game.id}`}
                      game={game}
                      isOwner={isOwner}
                      isMarketGrid={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : catalogState.viewMode === "list" ? (
            <div className="space-y-4">
              {isOwner && (
                <EmptyCard
                  text={t("txtGame")}
                  buttonLabel={type === "selling" ? t("txtSellGame") : t("txtLookForGame")}
                  buttonLink="/user/collection/games/add/"
                  viewMode="list"
                />
              )}
              {games.map((game) => (
                <PublicProfileGameList key={game.id} game={game} isOwner={isOwner} type="trade" />
              ))}
            </div>
          ) : (
            <div
              className={`grid ${
                catalogState.viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
              } gap-6`}
            >
              {isOwner && (
                <EmptyCard
                  text={t("txtGame")}
                  buttonLabel={type === "selling" ? t("txtSellGame") : t("txtLookForGame")}
                  buttonLink="/user/collection/games/add/"
                  viewMode={catalogState.viewMode === "grid" ? "card" : "compact"}
                />
              )}
              {games.map((game) =>
                catalogState.viewMode === "compact" ? (
                  <PublicProfileGameCompact
                    key={game.id}
                    game={game}
                    isOwner={isOwner}
                    type="trade"
                  />
                ) : (
                  <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner} type="trade" />
                ),
              )}
            </div>
          )}

          {gamesMeta && gamesMeta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={catalogState.page}
                totalPages={gamesMeta.totalPages}
                onPageChange={catalogState.setPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Seção de Acessórios */}
      {(accessories.length > 0 || isOwner) && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              {type === "selling" ? t("accessoriesForSale") : t("accessoriesLookingFor")}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAccessoryFilterOpen(true)}
              icon={<Settings2 size={16} />}
            />
          </div>

          {/* Drawer de Filtros para Acessórios */}
          <Drawer
            open={isAccessoryFilterOpen}
            onClose={() => setIsAccessoryFilterOpen(false)}
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

          {/* Controles de ordenação e paginação para acessórios */}
          <div className="flex justify-end items-center mb-4 gap-4">
            <SortSelect
              options={SORT_OPTIONS}
              value={accessoriesSort}
              onChange={handleAccessoriesSortChange}
              className="w-full sm:w-auto"
            />
            <Select
              options={PER_PAGE_OPTIONS}
              value={accessoriesPerPage.toString()}
              onChange={(e) => handleAccessoriesPerPageChange(Number(e.target.value))}
              className="w-20"
              size="sm"
            />
          </div>

          {catalogState.viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-2 text-left">Acessório</th>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Console</th>
                    <th className="p-2 text-left">Preço</th>
                    <th className="p-2 text-left">Condição</th>
                    <th className="p-2 text-left">Aceita Troca</th>
                    {isOwner && <th className="p-2 text-left">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {isOwner && (
                    <tr>
                      <td colSpan={6 + (isOwner ? 1 : 0)}>
                        <EmptyCard
                          text={t("txtAccessory")}
                          buttonLabel={
                            type === "selling" ? t("txtSellAccessory") : t("txtLookForAccessory")
                          }
                          buttonLink="/user/collection/accessories/add/"
                          viewMode="table"
                          space={false}
                        />
                      </td>
                    </tr>
                  )}
                  {accessories.map((accessory) => (
                    <AccessoryTableRow
                      key={`accessory-${accessory.id}`}
                      accessory={accessory}
                      isOwner={isOwner}
                      type="trade"
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : catalogState.viewMode === "list" ? (
            <div className="space-y-4">
              {isOwner && (
                <EmptyCard
                  text={t("txtAccessory")}
                  buttonLabel={
                    type === "selling" ? t("txtSellAccessory") : t("txtLookForAccessory")
                  }
                  buttonLink="/user/collection/accessories/add/"
                  viewMode="list"
                />
              )}
              {accessories.map((accessory) => (
                <AccessoryListItem
                  key={accessory.id}
                  accessory={accessory}
                  isOwner={isOwner}
                  type="trade"
                />
              ))}
            </div>
          ) : (
            <div
              className={`grid ${
                catalogState.viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
              } gap-6`}
            >
              {isOwner && (
                <EmptyCard
                  text={t("txtAccessory")}
                  buttonLabel={
                    type === "selling" ? t("txtSellAccessory") : t("txtLookForAccessory")
                  }
                  buttonLink="/user/collection/accessories/add/"
                  viewMode={catalogState.viewMode === "grid" ? "card" : "compact"}
                />
              )}
              {accessories.map((accessory) =>
                catalogState.viewMode === "compact" ? (
                  <AccessoryCompactCard
                    key={accessory.id}
                    accessory={accessory}
                    isOwner={isOwner}
                    type="trade"
                  />
                ) : (
                  <AccessoryCard
                    key={accessory.id}
                    accessory={accessory}
                    isOwner={isOwner}
                    type="trade"
                  />
                ),
              )}
            </div>
          )}

          {accessoriesMeta && accessoriesMeta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={accessoriesPage}
                totalPages={accessoriesMeta.totalPages}
                onPageChange={handleAccessoriesPageChange}
              />
            </div>
          )}
        </div>
      )}

      {games.length === 0 && consoles.length === 0 && accessories.length === 0 && !isOwner && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {type === "selling" ? t("noItemsForSale") : t("noItemsLookingFor")}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
