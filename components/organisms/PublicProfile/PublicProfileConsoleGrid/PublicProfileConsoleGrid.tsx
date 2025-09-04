// components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid.tsx
"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";
import { useUserConsolesPublic } from "@/hooks/usePublicProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { UserConsole } from "@/@types/collection.types";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { Settings2, Grid3X3, List, Table, ListChecks } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import FilterContainer from "@/components/molecules/Filter/ConsoleFilterContainer";
import { Select } from "@/components/atoms/Select/Select";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { PublicProfileConsoleTable } from "../PublicProfileConsoleCard/PublicProfileConsoleTable";
import { PublicProfileConsoleList } from "../PublicProfileConsoleCard/PublicProfileConsoleList";
import { PublicProfileConsoleCompact } from "../PublicProfileConsoleCard/PublicProfileConsoleCompact";

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

// Chave para armazenar as preferências no localStorage
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
  const sort = searchParams.get("sort") || "name-asc";
  const search = searchParams.get("search") || "";
  const brand = searchParams.get("brand") || "";
  const generation = searchParams.get("generation") || "";
  const model = searchParams.get("model") || "";
  const type = searchParams.get("type") || "";
  const allDigital = searchParams.get("allDigital") || "";

  // Estados para todos os filtros
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
    "OWNED", // status fixo para coleção
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
  );

  const consoles = data?.items || [];
  const meta = data?.meta;

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

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
    updateURL({ brand: brands.join(",") });
  };

  const handleGenerationChange = (generations: string[]) => {
    setSelectedGenerations(generations);
    updateURL({ generation: generations.join(",") });
  };

  const handleModelChange = (models: string[]) => {
    setSelectedModels(models);
    updateURL({ model: models.join(",") });
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    updateURL({ type: types.join(",") });
  };

  const handleAllDigitalChange = (allDigital: boolean) => {
    setSelectedAllDigital(allDigital);
    updateURL({ allDigital: allDigital ? "true" : "" });
  };

  const handleMediaFormatChange = (formats: string[]) => {
    setSelectedMediaFormats(formats);
    updateURL({ mediaFormats: formats.join(",") });
  };

  const handleRetroCompatibleChange = (isRetroCompatible: boolean) => {
    setRetroCompatible(isRetroCompatible);
    updateURL({ retroCompatible: isRetroCompatible.toString() });
  };

  const handleStorageChange = (ranges: string[]) => {
    setSelectedStorageRanges(ranges);
    updateURL({ storage: ranges.join(",") });
  };

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
          onBrandChange={handleBrandChange}
          onGenerationChange={handleGenerationChange}
          onModelChange={handleModelChange}
          onAllDigitalChange={handleAllDigitalChange}
          onTypeChange={handleTypeChange}
          onMediaFormatChange={handleMediaFormatChange}
          onRetroCompatibleChange={handleRetroCompatibleChange}
          onStorageChange={handleStorageChange}
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

      {!consoles || consoles.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t("noConsoles")}</p>
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
                    <th className="p-2 text-left">Console</th>
                    <th className="p-2 text-left">Skin</th>
                    {isOwner && <th className="p-2 text-left">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {consoles.map((consoleItem: UserConsole) => (
                    <PublicProfileConsoleTable
                      key={consoleItem.id}
                      consoleItem={consoleItem}
                      isOwner={isOwner || false}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-4">
              {consoles.map((consoleItem: UserConsole) => (
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
              {consoles.map((consoleItem: UserConsole) =>
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
    </div>
  );
};
