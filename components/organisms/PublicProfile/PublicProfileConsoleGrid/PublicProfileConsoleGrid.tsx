// components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";
import { PublicProfileConsoleCompact } from "../PublicProfileConsoleCard/PublicProfileConsoleCompact";
import { PublicProfileConsoleList } from "../PublicProfileConsoleCard/PublicProfileConsoleList";
import { PublicProfileConsoleTable } from "../PublicProfileConsoleCard/PublicProfileConsoleTable";
import { useUserConsolesPublic, useUserAccessoriesPublic } from "@/hooks/usePublicProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { UserAccessory, UserConsole } from "@/@types/collection.types";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { Settings2, Grid3X3, List, Table, ListChecks } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { Select } from "@/components/atoms/Select/Select";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { EmptyCard } from "../EmptyCard/EmptyCard";
import { usePublicProfileCatalog } from "@/hooks/usePublicProfileCatalog";
import { useConsoleFilters } from "@/hooks/useConsoleFilters";
import ConsoleFilterContainer from "@/components/molecules/Filter/ConsoleFilterContainer";
import { AccessoryCard } from "../AccessoryCard/AccessoryCard";
import { AccessoryCompactCard } from "../AccessoryCard/AccessoryCompactCard";
import { AccessoryListItem } from "../AccessoryCard/AccessoryListItem";
import { AccessoryTableRow } from "../AccessoryCard/AccessoryTableRow";
import {
  ConsoleAccessories,
  ConsoleAccessoriesCompact,
  ConsoleAccessoriesList,
  ConsoleAccessoriesTable,
} from "./ConsoleAccessories";
import { ViewMode } from "@/@types/catalog-state.types";

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

const PublicProfileConsoleGridContent = ({
  slug,
  locale,
  isOwner,
}: PublicProfileConsoleGridProps) => {
  const t = useTranslations("PublicProfile");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Estado do catálogo principal
  const catalogState = usePublicProfileCatalog({
    storageKey: "userConsolesViewPreferences",
    defaultViewMode: "grid",
    defaultPerPage: 50,
    defaultSort: "name-asc", // ← VALOR VÁLIDO
  });

  // Estado para acessórios avulsos
  const [accessoriesPage, setAccessoriesPage] = useState(1);
  const [accessoriesPerPage, setAccessoriesPerPage] = useState(20);
  const [accessoriesSort, setAccessoriesSort] = useState("createdAt-desc");

  // Filtros de consoles
  const consoleFilters = useConsoleFilters();

  // Buscar dados de consoles
  const { data, isLoading, error } = useUserConsolesPublic(
    slug,
    locale,
    "OWNED",
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
    "OWNED",
  );

  // Buscar dados de acessórios avulsos
  const {
    data: accessoriesData,
    isLoading: accessoriesLoading,
    error: accessoriesError,
  } = useUserAccessoriesPublic(slug, accessoriesPage, accessoriesPerPage, accessoriesSort, "OWNED");

  const consoles = data?.items || [];
  const meta = data?.meta;
  const accessories = accessoriesData?.items || [];
  const accessoriesMeta = accessoriesData?.meta;

  // Estados para colapse de acessórios
  const gridCols = useResponsiveColumns();
  const compactCols = useCompactColumns();

  const [openGridId, setOpenGridId] = useState<number | null>(null);
  const [openGridRowStart, setOpenGridRowStart] = useState<number | null>(null);
  const [openCompactId, setOpenCompactId] = useState<number | null>(null);
  const [openCompactRowStart, setOpenCompactRowStart] = useState<number | null>(null);
  const [openListId, setOpenListId] = useState<number | null>(null);
  const [openTableId, setOpenTableId] = useState<number | null>(null);

  // Console selecionado para colapse
  const selectedGridConsole = useMemo(
    () => (openGridId != null ? consoles.find((c) => c.id === openGridId) : undefined),
    [openGridId, consoles],
  );

  // Opções de ordenação
  const SORT_OPTIONS: SortOption[] = [
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

  const ACCESSORIES_SORT_OPTIONS = [
    { value: "name-asc", label: "Nome (A-Z)" },
    { value: "name-desc", label: "Nome (Z-A)" },
    { value: "createdAt-desc", label: "Mais recentes" },
    { value: "createdAt-asc", label: "Mais antigos" },
    { value: "price-asc", label: "Preço (menor)" },
    { value: "price-desc", label: "Preço (maior)" },
  ];

  const consoleHasAccessories = (item: UserConsole) =>
    Array.isArray(item.accessories) && item.accessories.length > 0;

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

  // Handlers para colapse de acessórios
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

  // Funções de renderização para acessórios avulsos
  const renderAccessoriesGrid = (accessories: UserAccessory[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {isOwner && (
        <EmptyCard
          text={t("txtAccessory")}
          buttonLabel={t("txtAddAccessory")}
          buttonLink="/user/collection/accessories/add/"
          viewMode="card"
        />
      )}
      {accessories.map((accessory) => (
        <AccessoryCard key={accessory.id} accessory={accessory} isOwner={isOwner} />
      ))}
    </div>
  );

  const renderAccessoriesCompactView = (accessories: UserAccessory[]) => (
    <div className="flex flex-wrap gap-3">
      {isOwner && (
        <EmptyCard
          text={t("txtAccessory")}
          buttonLabel={t("txtAddAccessory")}
          buttonLink="/user/collection/accessories/add/"
          viewMode="compact"
        />
      )}
      {accessories.map((accessory) => (
        <div
          key={accessory.id}
          className="
            box-border min-w-0
            flex-[0_0_calc(33.333%_-_.5rem)]
            md:flex-[0_0_calc(25%_-_.5625rem)]
            lg:flex-[0_0_calc(16.666%_-_.625rem)]
            xl:flex-[0_0_calc(12.5%_-_.65625rem)]
          "
        >
          <AccessoryCompactCard accessory={accessory} isOwner={isOwner} />
        </div>
      ))}
    </div>
  );

  const renderAccessoriesListView = (accessories: UserAccessory[]) => (
    <div className="space-y-4">
      {isOwner && (
        <EmptyCard
          text={t("txtAccessory")}
          buttonLabel={t("txtAddAccessory")}
          buttonLink="/user/collection/accessories/add/"
          viewMode="list"
        />
      )}
      {accessories.map((accessory) => (
        <AccessoryListItem key={accessory.id} accessory={accessory} isOwner={isOwner} />
      ))}
    </div>
  );

  const renderAccessoriesTableView = (accessories: UserAccessory[]) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="p-2 text-left">Acessório</th>
            <th className="p-2 text-left">Preço</th>
            <th className="p-2 text-left">Condição</th>
            {isOwner && <th className="p-2 text-left">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {isOwner && (
            <EmptyCard
              text={t("txtAccessory")}
              buttonLabel={t("txtAddAccessory")}
              buttonLink="/user/collection/accessories/add/"
              viewMode="table"
            />
          )}
          {accessories.map((accessory) => (
            <AccessoryTableRow key={accessory.id} accessory={accessory} isOwner={isOwner} />
          ))}
        </tbody>
      </table>
    </div>
  );

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
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="w-full lg:flex-1">
          <SearchBar compact searchPath={`/user/${slug}`} placeholder={t("searchConsoles")} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="w-full md:w-full lg:w-auto">
            <SortSelect
              options={SORT_OPTIONS}
              value={catalogState.sort}
              onChange={catalogState.setSort}
              className="w-full lg:w-auto"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-start lg:justify-end">
            <Select
              options={PER_PAGE_OPTIONS}
              value={catalogState.perPage.toString()}
              onChange={(e) => catalogState.setPerPage(Number(e.target.value))}
              className="min-w-25"
              size="sm"
            />
            <Dropdown
              items={[
                { value: "grid", label: t("viewMode.grid"), icon: <Grid3X3 size={16} /> },
                { value: "compact", label: t("viewMode.compact"), icon: <ListChecks size={16} /> },
                { value: "list", label: t("viewMode.list"), icon: <List size={16} /> },
                { value: "table", label: t("viewMode.table"), icon: <Table size={16} /> },
              ].map((option) => ({
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
                    [
                      ["grid", <Grid3X3 size={16} key="g" />],
                      ["compact", <ListChecks size={16} key="c" />],
                      ["list", <List size={16} key="l" />],
                      ["table", <Table size={16} key="t" />],
                    ].find(([v]) => v === catalogState.viewMode)?.[1] as React.ReactNode
                  }
                />
              }
              menuClassName="min-w-40"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterDrawerOpen(true)}
              icon={<Settings2 size={16} />}
            />
          </div>
        </div>
      </div>

      {/* Drawer de Filtros */}
      <Drawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
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

      {/* Conteúdo de Consoles */}
      {!consoles || consoles.length === 0 ? (
        <Card>
          <div className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{t("noConsoles")}</p>
            {isOwner && (
              <EmptyCard
                text={t("txtConsole")}
                buttonLabel={t("txtAddConsole")}
                buttonLink="/user/collection/consoles/add/"
                viewMode="list"
              />
            )}
          </div>
        </Card>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("collection")}</h2>

          {/* Renderização por view mode - CORRIGIDA */}
          {catalogState.viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-2 w-10" />
                    <th className="p-2 text-left">Console</th>
                    <th className="p-2 text-left">Skin</th>
                    {isOwner && <th className="p-2 text-left">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {isOwner && (
                    <EmptyCard
                      text={t("txtConsole")}
                      buttonLabel={t("txtAddConsole")}
                      buttonLink="/user/collection/consoles/add/"
                      viewMode="table"
                      space={true}
                    />
                  )}
                  {consoles.map((consoleItem: UserConsole) => {
                    const isExpanded = openTableId === consoleItem.id;
                    const canExpand = consoleHasAccessories(consoleItem);
                    return (
                      <React.Fragment key={consoleItem.id}>
                        <PublicProfileConsoleTable
                          consoleItem={consoleItem}
                          isOwner={isOwner}
                          isExpanded={isExpanded}
                          onToggleAccessories={
                            canExpand
                              ? () =>
                                  setOpenTableId((prev) =>
                                    prev === consoleItem.id ? null : (consoleItem.id as number),
                                  )
                              : undefined
                          }
                        />
                        {/* CORREÇÃO: Renderizar acessórios quando expandido */}
                        {isExpanded && (
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            <td colSpan={isOwner ? 4 : 3} className="p-4">
                              <ConsoleAccessoriesTable item={consoleItem} isOwner={isOwner} />
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
                  buttonLabel={t("txtAddConsole")}
                  buttonLink="/user/collection/consoles/add/"
                  viewMode="list"
                />
              )}
              {consoles.map((consoleItem: UserConsole) => {
                const isOpen = openListId === consoleItem.id;
                return (
                  <div key={consoleItem.id} className="flex flex-col gap-2">
                    <PublicProfileConsoleList
                      consoleItem={consoleItem}
                      isOwner={isOwner}
                      isExpanded={isOpen}
                      onToggleAccessories={() => handleToggleList(consoleItem.id as number)}
                    />
                    {/* CORREÇÃO: Renderizar acessórios quando expandido */}
                    {isOpen && (
                      <div>
                        <ConsoleAccessoriesList item={consoleItem} isOwner={isOwner} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : catalogState.viewMode === "compact" ? (
            <div className="flex flex-wrap gap-3">
              {isOwner && (
                <div className="box-border min-w-0 flex flex-col flex-[0_0_calc(33.333%_-_.5rem)] md:flex-[0_0_calc(25%_-_.5625rem)] lg:flex-[0_0_calc(16.666%_-_.625rem)] xl:flex-[0_0_calc(12.5%_-_.65625rem)]">
                  <EmptyCard
                    text={t("txtConsole")}
                    buttonLabel={t("txtAddConsole")}
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
                    <div className="box-border min-w-0 flex flex-col flex-[0_0_calc(33.333%_-_.5rem)] md:flex-[0_0_calc(25%_-_.5625rem)] lg:flex-[0_0_calc(16.666%_-_.625rem)] xl:flex-[0_0_calc(12.5%_-_.65625rem)]">
                      <PublicProfileConsoleCompact
                        consoleItem={consoleItem}
                        isOwner={isOwner}
                        isExpanded={isOpen}
                        onToggleAccessories={() =>
                          handleToggleCompact(gridIndex, consoleItem.id as number)
                        }
                      />
                    </div>

                    {/* CORREÇÃO: Renderizar acessórios quando expandido */}
                    {shouldRenderAccessoriesRow && (
                      <div className="basis-full">
                        <ConsoleAccessoriesCompact
                          item={consoles.find((c) => c.id === openCompactId)}
                          isOwner={isOwner}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // View mode GRID
            <div className="flex flex-wrap gap-6">
              {isOwner && (
                <div className="box-border min-w-0 flex-[0_0_calc(50%_-_.75rem)] md:flex-[0_0_calc(33.333%_-_1rem)] lg:flex-[0_0_calc(25%_-_1.125rem)] flex flex-col">
                  <EmptyCard
                    text={t("txtConsole")}
                    buttonLabel={t("txtAddConsole")}
                    buttonLink="/user/collection/consoles/add/"
                    viewMode="card"
                  />
                </div>
              )}
              {consoles.map((consoleItem: UserConsole, index: number) => {
                const isOpen = openGridId === consoleItem.id;
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
                    <div className="box-border min-w-0 flex-[0_0_calc(50%_-_.75rem)] md:flex-[0_0_calc(33.333%_-_1rem)] lg:flex-[0_0_calc(25%_-_1.125rem)] flex flex-col">
                      <PublicProfileConsoleCard
                        consoleItem={consoleItem}
                        isOwner={isOwner}
                        isExpanded={isOpen}
                        onToggleAccessories={() =>
                          handleToggleGrid(gridIndex, consoleItem.id as number)
                        }
                      />
                    </div>

                    {/* CORREÇÃO: Renderizar acessórios quando expandido */}
                    {shouldRenderAccessoriesRow && (
                      <div className="basis-full">
                        <ConsoleAccessories item={selectedGridConsole} isOwner={isOwner} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Paginação de Consoles */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={catalogState.page}
            totalPages={meta.totalPages}
            onPageChange={catalogState.setPage}
          />
        </div>
      )}

      {/* Seção de Acessórios Avulsos - MANTIDA DO ORIGINAL */}
      {accessoriesLoading && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Acessórios Avulsos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {accessoriesError && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Acessórios Avulsos</h2>
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Erro ao carregar acessórios</p>
            </div>
          </Card>
        </div>
      )}

      {accessoriesData && accessories.length > 0 ? (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">Acessórios Avulsos</h2>

            <div className="flex items-center gap-4">
              <Select
                options={ACCESSORIES_SORT_OPTIONS}
                value={accessoriesSort}
                onChange={(e) => handleAccessoriesSortChange(e.target.value)}
                className="w-40"
                size="sm"
              />

              <Select
                options={PER_PAGE_OPTIONS}
                value={accessoriesPerPage.toString()}
                onChange={(e) => handleAccessoriesPerPageChange(Number(e.target.value))}
                className="w-20"
                size="sm"
              />
            </div>
          </div>

          {catalogState.viewMode === "grid" && renderAccessoriesGrid(accessories)}
          {catalogState.viewMode === "compact" && renderAccessoriesCompactView(accessories)}
          {catalogState.viewMode === "list" && renderAccessoriesListView(accessories)}
          {catalogState.viewMode === "table" && renderAccessoriesTableView(accessories)}

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
      ) : (
        isOwner && (
          <div className="mt-4">
            <EmptyCard
              text={t("txtAccessory")}
              buttonLabel={t("txtAddAccessory")}
              buttonLink="/user/collection/accessories/add/"
              viewMode="list"
            />
          </div>
        )
      )}
    </div>
  );
};
