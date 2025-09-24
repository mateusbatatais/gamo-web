"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";
import { useUserConsolesPublic, useUserAccessoriesPublic } from "@/hooks/usePublicProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { UserAccessory, UserConsole } from "@/@types/collection.types";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { Settings2, Grid3X3, List, Table, ListChecks } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import FilterContainer from "@/components/molecules/Filter/ConsoleFilterContainer";
import { Select } from "@/components/atoms/Select/Select";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { PublicProfileConsoleTable } from "../PublicProfileConsoleCard/PublicProfileConsoleTable";
import { PublicProfileConsoleList } from "../PublicProfileConsoleCard/PublicProfileConsoleList";
import { PublicProfileConsoleCompact } from "../PublicProfileConsoleCard/PublicProfileConsoleCompact";
import Image from "next/image";
import { AccessoryCard } from "../AccessoryCard/AccessoryCard";
import { AccessoryCompactCard } from "../AccessoryCard/AccessoryCompactCard";
import { AccessoryListItem } from "../AccessoryCard/AccessoryListItem";
import { AccessoryTableRow } from "../AccessoryCard/AccessoryTableRow";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { EmptyCard } from "../EmptyCard/EmptyCard";

// Tipos/guard locais (sem any)
interface Accessory {
  id: number;
  name: string;
  slug: string;
  photoMain?: string;
}
function hasAccessories(
  item: UserConsole,
): item is UserConsole & { accessories: ReadonlyArray<Accessory> } {
  const maybe = item as unknown as { accessories?: unknown };
  return Array.isArray(maybe.accessories) && maybe.accessories.length > 0;
}

// Hooks de colunas
function useResponsiveColumns(): number {
  const [cols, setCols] = useState<number>(2);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024)
        setCols(4); // lg
      else if (w >= 768)
        setCols(3); // md
      else setCols(2); // base
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

type ViewMode = "grid" | "compact" | "list" | "table";
const STORAGE_KEY = "userConsolesViewPreferences";

const PublicProfileConsoleGridContent = ({
  slug,
  locale,
  isOwner,
}: PublicProfileConsoleGridProps) => {
  const t = useTranslations("PublicProfile");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [localPerPage, setLocalPerPage] = useState(50);

  // Estados para acessórios avulsos
  const [accessoriesPage, setAccessoriesPage] = useState(1);
  const [accessoriesPerPage, setAccessoriesPerPage] = useState(20);
  const [accessoriesSort, setAccessoriesSort] = useState("createdAt-desc");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const prefs: { viewMode?: ViewMode; perPage?: string } = JSON.parse(saved);
        if (prefs.viewMode) setViewMode(prefs.viewMode);
        if (prefs.perPage) setLocalPerPage(Number(prefs.perPage));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const prefs = { viewMode, perPage: localPerPage.toString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [viewMode, localPerPage]);

  // URL params
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || localPerPage.toString());
  const sort = searchParams.get("sort") || "name-asc";
  const search = searchParams.get("search") || "";
  const brand = searchParams.get("brand") || "";
  const generation = searchParams.get("generation") || "";
  const model = searchParams.get("model") || "";
  const type = searchParams.get("type") || "";
  const allDigital = searchParams.get("allDigital") || "";

  // Filtros
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    brand ? brand.split(",").filter(Boolean) : [],
  );
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>(
    generation ? generation.split(",").filter(Boolean) : [],
  );
  const [selectedModels, setSelectedModels] = useState<string[]>(
    model ? model.split(",").filter(Boolean) : [],
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    type ? type.split(",").filter(Boolean) : [],
  );
  const [selectedAllDigital, setSelectedAllDigital] = useState<boolean>(allDigital === "true");
  const [selectedMediaFormats, setSelectedMediaFormats] = useState<string[]>(
    searchParams.get("mediaFormats")?.split(",").filter(Boolean) || [],
  );
  const [retroCompatible, setRetroCompatible] = useState<boolean>(
    searchParams.get("retroCompatible") === "true",
  );
  const [selectedStorageRanges, setSelectedStorageRanges] = useState<string[]>(
    searchParams.get("storage")?.split(",").filter(Boolean) || [],
  );

  const { data, isLoading, error } = useUserConsolesPublic(
    slug,
    locale,
    "OWNED",
    page,
    perPage,
    sort,
    search,
    selectedBrands.join(","),
    selectedGenerations.join(","),
    selectedModels.join(","),
    selectedTypes.join(","),
    selectedMediaFormats.join(","),
    selectedStorageRanges.join(","),
    retroCompatible,
    selectedAllDigital,
    "OWNED",
  );

  const {
    data: accessoriesData,
    isLoading: accessoriesLoading,
    error: accessoriesError,
  } = useUserAccessoriesPublic(slug, accessoriesPage, accessoriesPerPage, accessoriesSort, "OWNED");

  const consoles = data?.items || [];
  const meta = data?.meta;
  const accessories = accessoriesData?.items || [];
  const accessoriesMeta = accessoriesData?.meta;

  const SORT_OPTIONS: SortOption[] = [
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "addedDate-desc", label: t("order.addedDateDesc") },
    { value: "addedDate-asc", label: t("order.addedDateAsc") },
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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePerPageChange = (newPerPage: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("perPage", newPerPage);
    params.set("page", "1");
    setLocalPerPage(Number(newPerPage));
    router.push(`?${params.toString()}`);
  };

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

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedGenerations([]);
    setSelectedModels([]);
    setSelectedTypes([]);
    setSelectedAllDigital(false);
    setSelectedMediaFormats([]);
    setRetroCompatible(false);
    setSelectedStorageRanges([]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("brand");
    params.delete("generation");
    params.delete("model");
    params.delete("type");
    params.delete("allDigital");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // --------- Estado do colapse por modo ----------
  const gridCols = useResponsiveColumns();
  const [openGridId, setOpenGridId] = useState<number | null>(null);
  const [openGridRowStart, setOpenGridRowStart] = useState<number | null>(null);

  const selectedGridConsole = useMemo(
    () => (openGridId != null ? consoles.find((c) => c.id === openGridId) : undefined),
    [openGridId, consoles],
  );

  const handleToggleGrid = (index: number, id: number) => {
    const rowStart = index - (index % gridCols);
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

  // COMPACT
  const compactCols = useCompactColumns();
  const [openCompactId, setOpenCompactId] = useState<number | null>(null);
  const [openCompactRowStart, setOpenCompactRowStart] = useState<number | null>(null);

  const handleToggleCompact = (index: number, id: number) => {
    const rowStart = index - (index % compactCols);
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

  // LIST
  const [openListId, setOpenListId] = useState<number | null>(null);
  const handleToggleList = (id: number) => {
    setOpenListId((prev) => (prev === id ? null : id));
  };

  // TABLE
  const [openTableId, setOpenTableId] = useState<number | null>(null);
  const tableCols = 1 /*expander*/ + 2 /*Console + Skin*/ + (isOwner ? 1 : 0);

  // --------- Renderizadores de acessórios ----------
  function AccessoriesCard({ acc }: { acc: UserAccessory; isOwner: boolean }) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-36 bg-gray-100 dark:bg-gray-700 relative">
          <AccessoryActionButtons
            accessory={acc}
            isOwner={isOwner || false}
            customClassName="absolute top-2 right-2 z-10"
          />
          {acc.photoMain ? (
            <Image
              src={acc.photoMain}
              alt={acc.variantName || ""}
              fill
              sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-2xl">🖥️</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <p className="font-medium dark:text-white">{acc.variantName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{acc.accessorySlug}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function RenderAccessoriesTitle({ item }: { item?: UserConsole }) {
    return (
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold dark:text-white">
          Acessórios
          {item?.consoleName && (
            <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
              — {item.consoleName}
            </span>
          )}
        </h3>
      </div>
    );
  }

  function renderAccessoriesCompact(item?: UserConsole): React.ReactNode {
    if (!item || !hasAccessories(item)) {
      return (
        <Card className="p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Nenhum acessório cadastrado para este console.
          </div>
        </Card>
      );
    }
    return (
      <Card className="p-4">
        <RenderAccessoriesTitle item={item} />
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {item.accessories.map((acc) => (
            <div key={acc.id} className="aspect-square">
              <AccessoriesCard acc={acc} isOwner={isOwner || false} />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  function renderAccessoriesList(item?: UserConsole): React.ReactNode {
    if (!item || !hasAccessories(item)) {
      return (
        <Card className="p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Nenhum acessório cadastrado para este console.
          </div>
        </Card>
      );
    }
    return (
      <Card className="p-4">
        <RenderAccessoriesTitle item={item} />
        <div className="space-y-3">
          {item.accessories.map((acc) => (
            <Card key={acc.id} className="!p-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative rounded-md overflow-hidden">
                  {acc.photoMain ? (
                    <Image
                      src={acc.photoMain}
                      alt={acc.variantName || ""}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xl">🖥️</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium dark:text-white truncate">{acc.variantName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {acc.accessorySlug}
                  </p>
                </div>
                <AccessoryActionButtons
                  accessory={acc}
                  isOwner={isOwner || false}
                  customClassName="flex-grow justify-end"
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>
    );
  }

  function renderAccessoriesTable(item?: UserConsole): React.ReactNode {
    if (!item || !hasAccessories(item)) {
      return (
        <Card className="p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Nenhum acessório cadastrado para este console.
          </div>
        </Card>
      );
    }
    return (
      <div className="overflow-x-auto ps-10">
        <table className="w-full">
          <thead>
            <tr className="border-t border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th className="p-2 text-left">Acessório</th>
              <th className="p-2 text-left">Slug</th>
              {isOwner && <th className="p-2 ">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {item.accessories.map((acc) => (
              <tr key={acc.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {acc.photoMain ? (
                        <Image
                          src={acc.photoMain}
                          alt={acc.variantName || ""}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>🖥️</span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium dark:text-white">{acc.variantName}</span>
                  </div>
                </td>
                <td className="p-2 text-sm text-gray-600 dark:text-gray-300">
                  {acc.accessorySlug}
                </td>
                {isOwner && (
                  <td className="p-2 text-center">
                    <AccessoryActionButtons accessory={acc} isOwner={isOwner} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

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
        <AccessoryCard key={accessory.id} accessory={accessory} isOwner={isOwner || false} />
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
          <AccessoryCompactCard accessory={accessory} isOwner={isOwner || false} />
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
        <AccessoryListItem key={accessory.id} accessory={accessory} isOwner={isOwner || false} />
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
            <AccessoryTableRow
              key={accessory.id}
              accessory={accessory}
              isOwner={isOwner || false}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  // --------- UI ---------
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
      {/* header de filtros/ordenação */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
          <SearchBar compact searchPath={`/user/${slug}`} placeholder={t("searchConsoles")} />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
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
            items={[
              { value: "grid", label: t("viewMode.grid"), icon: <Grid3X3 size={16} /> },
              { value: "compact", label: t("viewMode.compact"), icon: <ListChecks size={16} /> },
              { value: "list", label: t("viewMode.list"), icon: <List size={16} /> },
              { value: "table", label: t("viewMode.table"), icon: <Table size={16} /> },
            ].map((option) => ({
              id: option.value,
              label: option.label,
              icon: option.icon,
              onClick: () => setViewMode(option.value as ViewMode),
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
                  ].find(([v]) => v === viewMode)?.[1] as React.ReactNode
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

      {/* Drawer de Filtros */}
      <Drawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filtrar Consoles"
        anchor="right"
        className="w-full max-w-md"
      >
        <FilterContainer
          onBrandChange={setSelectedBrands}
          onGenerationChange={setSelectedGenerations}
          onModelChange={setSelectedModels}
          onAllDigitalChange={setSelectedAllDigital}
          onTypeChange={setSelectedTypes}
          onMediaFormatChange={setSelectedMediaFormats}
          onRetroCompatibleChange={setRetroCompatible}
          onStorageChange={setSelectedStorageRanges}
          selectedStorageRanges={selectedStorageRanges}
          selectedBrands={selectedBrands}
          selectedGenerations={selectedGenerations}
          selectedModels={selectedModels}
          selectedAllDigital={selectedAllDigital}
          selectedTypes={selectedTypes}
          selectedMediaFormats={selectedMediaFormats}
          retroCompatible={retroCompatible}
          clearFilters={clearFilters}
        />
      </Drawer>

      {/* conteúdo */}
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

          {viewMode === "table" ? (
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
                    const canExpand = hasAccessories(consoleItem);
                    return (
                      <React.Fragment key={consoleItem.id}>
                        <PublicProfileConsoleTable
                          consoleItem={consoleItem}
                          isOwner={isOwner || false}
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
                        {isExpanded && (
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            <td colSpan={tableCols} className="p-4">
                              {renderAccessoriesTable(consoleItem)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : viewMode === "list" ? (
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
                      isOwner={isOwner || false}
                      isExpanded={isOpen}
                      onToggleAccessories={() => handleToggleList(consoleItem.id as number)}
                    />
                    {isOpen && <div>{renderAccessoriesList(consoleItem)}</div>}
                  </div>
                );
              })}
            </div>
          ) : viewMode === "compact" ? (
            <div className="flex flex-wrap gap-3">
              {isOwner && (
                <div
                  className="
                        box-border min-w-0 flex flex-col
                        flex-[0_0_calc(33.333%_-_.5rem)]       /* 3 col */
                        md:flex-[0_0_calc(25%_-_.5625rem)]     /* 4 col */
                        lg:flex-[0_0_calc(16.666%_-_.625rem)]  /* 6 col */
                        xl:flex-[0_0_calc(12.5%_-_.65625rem)]  /* 8 col */
                      "
                >
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

                const rowEndIndex = index - (index % compactCols) + (compactCols - 1);
                const isRowEnd = index === rowEndIndex || index === consoles.length - 1;

                const shouldRenderAccessoriesRow =
                  openCompactRowStart !== null &&
                  isRowEnd &&
                  index >= openCompactRowStart &&
                  index < openCompactRowStart + compactCols;

                return (
                  <div key={consoleItem.id} className="contents">
                    <div
                      className="
                        box-border min-w-0 flex flex-col
                        flex-[0_0_calc(33.333%_-_.5rem)]       /* 3 col */
                        md:flex-[0_0_calc(25%_-_.5625rem)]     /* 4 col */
                        lg:flex-[0_0_calc(16.666%_-_.625rem)]  /* 6 col */
                        xl:flex-[0_0_calc(12.5%_-_.65625rem)]  /* 8 col */
                      "
                    >
                      <PublicProfileConsoleCompact
                        consoleItem={consoleItem}
                        isOwner={isOwner || false}
                        isExpanded={isOpen}
                        onToggleAccessories={() =>
                          handleToggleCompact(index, consoleItem.id as number)
                        }
                      />
                    </div>

                    {shouldRenderAccessoriesRow && (
                      <div className="basis-full">
                        {renderAccessoriesCompact(consoles.find((c) => c.id === openCompactId))}
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
                    buttonLabel={t("txtAddConsole")}
                    buttonLink="/user/collection/consoles/add/"
                    viewMode="card"
                  />
                </div>
              )}
              {consoles.map((consoleItem: UserConsole, index: number) => {
                const isOpen = openGridId === consoleItem.id;
                const rowEndIndex = index - (index % gridCols) + (gridCols - 1);
                const isRowEnd = index === rowEndIndex || index === consoles.length - 1;

                const shouldRenderAccessoriesRow =
                  openGridRowStart !== null &&
                  isRowEnd &&
                  index >= openGridRowStart &&
                  index < openGridRowStart + gridCols;

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
                        consoleItem={consoleItem}
                        isOwner={isOwner || false}
                        isExpanded={isOpen}
                        onToggleAccessories={() =>
                          handleToggleGrid(index, consoleItem.id as number)
                        }
                      />
                    </div>

                    {shouldRenderAccessoriesRow && (
                      <div className="basis-full">
                        {renderAccessoriesCompact(selectedGridConsole)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Seção de Acessórios Avulsos */}
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

          {viewMode === "grid" && renderAccessoriesGrid(accessories)}
          {viewMode === "compact" && renderAccessoriesCompactView(accessories)}
          {viewMode === "list" && renderAccessoriesListView(accessories)}
          {viewMode === "table" && renderAccessoriesTableView(accessories)}

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
