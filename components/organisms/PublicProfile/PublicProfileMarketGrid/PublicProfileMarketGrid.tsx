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
import { useSearchParams, useRouter } from "next/navigation";
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
      <PublicProfileMarketGridContent slug={slug} locale={locale} isOwner={isOwner || false} />
    </QueryClientProvider>
  );
};

type ViewMode = "grid" | "compact" | "list" | "table";

// Chave para armazenar as preferências no localStorage
const STORAGE_KEY = "userMarketViewPreferences";

const PublicProfileMarketGridContent = ({
  slug,
  locale,
  isOwner,
}: PublicProfileMarketGridProps) => {
  const t = useTranslations("PublicProfile");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [localPerPage, setLocalPerPage] = useState(50);
  const [isGameFilterOpen, setIsGameFilterOpen] = useState(false);
  const [isConsoleFilterOpen, setIsConsoleFilterOpen] = useState(false);
  const [isAccessoryFilterOpen, setIsAccessoryFilterOpen] = useState(false);

  // Estados para filtros de jogos
  const [gameGenres, setGameGenres] = useState<number[]>([]);
  const [gamePlatforms, setGamePlatforms] = useState<number[]>([]);

  // Estados para filtros de consoles
  const [consoleBrands, setConsoleBrands] = useState<string[]>([]);
  const [consoleGenerations, setConsoleGenerations] = useState<string[]>([]);
  const [consoleModels, setConsoleModels] = useState<string[]>([]);
  const [consoleTypes, setConsoleTypes] = useState<string[]>([]);
  const [consoleAllDigital, setConsoleAllDigital] = useState<boolean>(false);
  const [consoleMediaFormats, setConsoleMediaFormats] = useState<string[]>([]);
  const [consoleRetroCompatible, setConsoleRetroCompatible] = useState<boolean>(false);
  const [consoleStorageRanges, setConsoleStorageRanges] = useState<string[]>([]);

  // Estados para filtros de acessórios
  const [accessoryTypes, setAccessoryTypes] = useState<string[]>([]);
  const [accessorySubTypes, setAccessorySubTypes] = useState<string[]>([]);
  const [accessoryConsoles, setAccessoryConsoles] = useState<string[]>([]);

  // Estados para paginação de acessórios
  const [accessoriesPage, setAccessoriesPage] = useState(1);
  const [accessoriesPerPage, setAccessoriesPerPage] = useState(20);
  const [accessoriesSort, setAccessoriesSort] = useState("createdAt-desc");

  useEffect(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        if (preferences.viewMode) {
          setViewMode(preferences.viewMode);
        }
        if (preferences.perPage) {
          setLocalPerPage(Number(preferences.perPage));
        }
      } catch (error) {
        console.error("Error parsing saved preferences:", error);
      }
    }
  }, []);

  useEffect(() => {
    const preferences = {
      viewMode,
      perPage: localPerPage.toString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [viewMode, localPerPage]);

  // Obter parâmetros da URL
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || localPerPage.toString());
  const type = searchParams.get("type") || "selling";
  const defaultSort = "createdAt-desc";
  const sortParam = searchParams.get("sort");
  const validSortOptions = ["createdAt-asc", "createdAt-desc", "price-asc", "price-desc"];
  const sort = sortParam && validSortOptions.includes(sortParam) ? sortParam : defaultSort;
  const search = searchParams.get("search") || "";
  const brand = searchParams.get("brand") || "";
  const generation = searchParams.get("generation") || "";
  const model = searchParams.get("model") || "";
  const consoleType = searchParams.get("consoleType") || "";
  const allDigital = searchParams.get("allDigital") || "";
  const mediaFormats = searchParams.get("mediaFormats") || "";
  const retroCompatible = searchParams.get("retroCompatible") || "";
  const storage = searchParams.get("storage") || "";
  const accessoryType = searchParams.get("accessoryType") || "";
  const accessorySubType = searchParams.get("accessorySubType") || "";
  const accessoryConsole = searchParams.get("accessoryConsole") || "";

  // Inicializar estados dos filtros a partir dos parâmetros da URL
  useEffect(() => {
    setConsoleBrands(brand ? brand.split(",").filter(Boolean) : []);
    setConsoleGenerations(generation ? generation.split(",").filter(Boolean) : []);
    setConsoleModels(model ? model.split(",").filter(Boolean) : []);
    setConsoleTypes(consoleType ? consoleType.split(",").filter(Boolean) : []);
    setConsoleAllDigital(allDigital === "true");
    setConsoleMediaFormats(mediaFormats ? mediaFormats.split(",").filter(Boolean) : []);
    setConsoleRetroCompatible(retroCompatible === "true");
    setConsoleStorageRanges(storage ? storage.split(",").filter(Boolean) : []);
    setAccessoryTypes(accessoryType ? accessoryType.split(",").filter(Boolean) : []);
    setAccessorySubTypes(accessorySubType ? accessorySubType.split(",").filter(Boolean) : []);
    setAccessoryConsoles(accessoryConsole ? accessoryConsole.split(",").filter(Boolean) : []);
  }, [
    brand,
    generation,
    model,
    consoleType,
    allDigital,
    mediaFormats,
    retroCompatible,
    storage,
    accessoryType,
    accessorySubType,
    accessoryConsole,
  ]);

  // Determinar o status baseado no tipo selecionado
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
    page,
    perPage,
    sort,
    search,
    gameGenres,
    gamePlatforms,
  );

  const {
    data: consolesData,
    isLoading: consolesLoading,
    error: consolesError,
  } = useUserConsolesPublic(
    slug,
    locale,
    status,
    page,
    perPage,
    sort,
    search,
    consoleBrands.join(","),
    consoleGenerations.join(","),
    consoleModels.join(","),
    consoleTypes.join(","),
    consoleMediaFormats.join(","),
    consoleStorageRanges.join(","),
    consoleRetroCompatible,
    consoleAllDigital,
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
    accessoryTypes.join(","),
    accessorySubTypes.join(","),
    accessoryConsoles.join(","),
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

  // Opções de ordenação compatíveis com ambas as APIs (jogos, consoles e acessórios)
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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleAccessoriesPageChange = (newPage: number) => {
    setAccessoriesPage(newPage);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleAccessoriesSortChange = (newSort: string) => {
    setAccessoriesSort(newSort);
    setAccessoriesPage(1);
  };

  const handlePerPageChange = (newPerPage: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("perPage", newPerPage);
    params.set("page", "1");
    setLocalPerPage(Number(newPerPage));
    router.push(`?${params.toString()}`);
  };

  const handleAccessoriesPerPageChange = (newPerPage: string) => {
    setAccessoriesPerPage(Number(newPerPage));
    setAccessoriesPage(1);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", newType);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleGameGenreChange = (genres: number[]) => {
    setGameGenres(genres);
  };

  const handleGamePlatformChange = (platforms: number[]) => {
    setGamePlatforms(platforms);
  };

  const clearGameFilters = () => {
    setGameGenres([]);
    setGamePlatforms([]);
  };

  const handleConsoleBrandChange = (brands: string[]) => {
    setConsoleBrands(brands);
    updateURL({ brand: brands.join(",") });
  };

  const handleConsoleGenerationChange = (generations: string[]) => {
    setConsoleGenerations(generations);
    updateURL({ generation: generations.join(",") });
  };

  const handleConsoleModelChange = (models: string[]) => {
    setConsoleModels(models);
    updateURL({ model: models.join(",") });
  };

  const handleConsoleTypeChange = (types: string[]) => {
    setConsoleTypes(types);
    updateURL({ consoleType: types.join(",") });
  };

  const handleConsoleAllDigitalChange = (allDigital: boolean) => {
    setConsoleAllDigital(allDigital);
    updateURL({ allDigital: allDigital ? "true" : "" });
  };

  const handleConsoleMediaFormatChange = (formats: string[]) => {
    setConsoleMediaFormats(formats);
    updateURL({ mediaFormats: formats.join(",") });
  };

  const handleConsoleRetroCompatibleChange = (isRetroCompatible: boolean) => {
    setConsoleRetroCompatible(isRetroCompatible);
    updateURL({ retroCompatible: isRetroCompatible.toString() });
  };

  const handleConsoleStorageChange = (ranges: string[]) => {
    setConsoleStorageRanges(ranges);
    updateURL({ storage: ranges.join(",") });
  };

  const handleAccessoryTypeChange = (types: string[]) => {
    setAccessoryTypes(types);
    updateURL({ accessoryType: types.join(",") });
  };

  const handleAccessorySubTypeChange = (subTypes: string[]) => {
    setAccessorySubTypes(subTypes);
    updateURL({ accessorySubType: subTypes.join(",") });
  };

  const handleAccessoryConsoleChange = (consoles: string[]) => {
    setAccessoryConsoles(consoles);
    updateURL({ accessoryConsole: consoles.join(",") });
  };

  // Função para atualizar a URL com filtros
  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const clearConsoleFilters = () => {
    setConsoleBrands([]);
    setConsoleGenerations([]);
    setConsoleModels([]);
    setConsoleTypes([]);
    setConsoleAllDigital(false);
    setConsoleMediaFormats([]);
    setConsoleRetroCompatible(false);
    setConsoleStorageRanges([]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("brand");
    params.delete("generation");
    params.delete("model");
    params.delete("consoleType");
    params.delete("allDigital");
    params.delete("mediaFormats");
    params.delete("retroCompatible");
    params.delete("storage");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const clearAccessoryFilters = () => {
    setAccessoryTypes([]);
    setAccessorySubTypes([]);
    setAccessoryConsoles([]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("accessoryType");
    params.delete("accessorySubType");
    params.delete("accessoryConsole");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
          <SearchBar compact searchPath={`/user/${slug}/market`} placeholder={t("searchMarket")} />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <ToggleGroup
            items={toggleItems}
            value={type}
            onChange={handleTypeChange}
            variant="secondary"
            size="sm"
          />
          <SortSelect
            options={SORT_OPTIONS}
            value={sort}
            onChange={handleSortChange}
            className="w-full sm:w-auto"
          />
          <Select
            options={PER_PAGE_OPTIONS}
            value={perPage.toString()}
            onChange={(e) => handlePerPageChange(e.target.value)}
            className="w-20"
            size="sm"
          />
          <Dropdown
            items={VIEW_MODE_OPTIONS.map((option) => ({
              id: option.value,
              label: option.label,
              icon: option.icon,
              onClick: () => handleViewModeChange(option.value as ViewMode),
            }))}
            trigger={
              <Button
                variant="outline"
                size="sm"
                icon={VIEW_MODE_OPTIONS.find((option) => option.value === viewMode)?.icon}
              />
            }
            menuClassName="min-w-40"
          />
        </div>
      </div>

      {/* Seção de Consoles */}
      {consoles.length > 0 && (
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
            ></Button>
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
              onBrandChange={handleConsoleBrandChange}
              onGenerationChange={handleConsoleGenerationChange}
              onModelChange={handleConsoleModelChange}
              onAllDigitalChange={handleConsoleAllDigitalChange}
              onTypeChange={handleConsoleTypeChange}
              onMediaFormatChange={handleConsoleMediaFormatChange}
              onRetroCompatibleChange={handleConsoleRetroCompatibleChange}
              onStorageChange={handleConsoleStorageChange}
              selectedBrands={consoleBrands}
              selectedGenerations={consoleGenerations}
              selectedModels={consoleModels}
              selectedAllDigital={consoleAllDigital}
              selectedTypes={consoleTypes}
              selectedMediaFormats={consoleMediaFormats}
              retroCompatible={consoleRetroCompatible}
              selectedStorageRanges={consoleStorageRanges}
              clearFilters={clearConsoleFilters}
            />
          </Drawer>

          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-2 text-left">Console</th>
                    <th className="p-2 text-left">Skin</th>
                    <th className="p-2 text-left">Preço</th>
                    <th className="p-2 text-left">Condição</th>
                    <th className="p-2 text-left">Aceita Troca</th>
                    {isOwner && <th className="p-2 text-left">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {consoles.map((consoleItem) => (
                    <PublicProfileConsoleTable
                      key={`console-${consoleItem.id}`}
                      consoleItem={consoleItem}
                      isOwner={isOwner || false}
                      isMarketGrid={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-4">
              {consoles.map((consoleItem) => (
                <PublicProfileConsoleList
                  key={consoleItem.id}
                  consoleItem={consoleItem}
                  isOwner={isOwner || false}
                />
              ))}
            </div>
          ) : (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
              } gap-6`}
            >
              {consoles.map((consoleItem) =>
                viewMode === "compact" ? (
                  <PublicProfileConsoleCompact
                    key={consoleItem.id}
                    consoleItem={consoleItem}
                    isOwner={isOwner || false}
                  />
                ) : (
                  <PublicProfileConsoleCard
                    key={consoleItem.id}
                    consoleItem={consoleItem}
                    isOwner={isOwner || false}
                  />
                ),
              )}
            </div>
          )}

          {consolesMeta && consolesMeta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={consolesMeta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Seção de Jogos */}
      {games.length > 0 && (
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
            ></Button>
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
              onGenreChange={handleGameGenreChange}
              onPlatformChange={handleGamePlatformChange}
              selectedGenres={gameGenres}
              selectedPlatforms={gamePlatforms}
              clearFilters={clearGameFilters}
            />
          </Drawer>

          {viewMode === "table" ? (
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
                  {games.map((game) => (
                    <PublicProfileGameTable
                      key={`game-${game.id}`}
                      game={game}
                      isOwner={isOwner || false}
                      isMarketGrid={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-4">
              {games.map((game) => (
                <PublicProfileGameList key={game.id} game={game} isOwner={isOwner || false} />
              ))}
            </div>
          ) : (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
              } gap-6`}
            >
              {games.map((game) =>
                viewMode === "compact" ? (
                  <PublicProfileGameCompact key={game.id} game={game} isOwner={isOwner || false} />
                ) : (
                  <PublicProfileGameCard key={game.id} game={game} isOwner={isOwner || false} />
                ),
              )}
            </div>
          )}

          {gamesMeta && gamesMeta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={gamesMeta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Seção de Acessórios */}
      {accessories.length > 0 && (
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
            ></Button>
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
              selectedTypes={accessoryTypes}
              selectedSubTypes={accessorySubTypes}
              selectedConsoles={accessoryConsoles}
              onTypeChange={handleAccessoryTypeChange}
              onSubTypeChange={handleAccessorySubTypeChange}
              onConsoleChange={handleAccessoryConsoleChange}
              clearFilters={clearAccessoryFilters}
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
              onChange={(e) => handleAccessoriesPerPageChange(e.target.value)}
              className="w-20"
              size="sm"
            />
          </div>

          {viewMode === "table" ? (
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
                  {accessories.map((accessory) => (
                    <AccessoryTableRow
                      key={`accessory-${accessory.id}`}
                      accessory={accessory}
                      isOwner={isOwner || false}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-4">
              {accessories.map((accessory) => (
                <AccessoryListItem
                  key={accessory.id}
                  accessory={accessory}
                  isOwner={isOwner || false}
                />
              ))}
            </div>
          ) : (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
              } gap-6`}
            >
              {accessories.map((accessory) =>
                viewMode === "compact" ? (
                  <AccessoryCompactCard
                    key={accessory.id}
                    accessory={accessory}
                    isOwner={isOwner || false}
                  />
                ) : (
                  <AccessoryCard
                    key={accessory.id}
                    accessory={accessory}
                    isOwner={isOwner || false}
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

      {games.length === 0 && consoles.length === 0 && accessories.length === 0 && (
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
