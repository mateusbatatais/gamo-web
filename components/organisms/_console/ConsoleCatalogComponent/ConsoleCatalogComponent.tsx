// components/organisms/ConsoleCatalogComponent/ConsoleCatalogComponent.tsx
"use client";

import { useState, useEffect } from "react";
import FilterContainer from "@/components/molecules/Filter/Filter";
import ConsoleCard from "@/components/molecules/_console/ConsoleCard/ConsoleCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { EmptyState } from "@/components/atoms/EmptyState/EmptyState";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ConsoleCardSkeleton } from "@/components/molecules/_console/ConsoleCard/ConsoleCard.skeleton";
import { ViewToggle, ViewType } from "@/components/molecules/ViewToggle/ViewToggle";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useConsoles } from "@/hooks/useConsoles";
import { ConsoleVariant } from "@/@types/catalog.types";

interface ConsoleCatalogComponentProps {
  locale: string;
  page: number;
  perPage: number;
}

const ConsoleCatalogComponent = ({ locale, page, perPage }: ConsoleCatalogComponentProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<ViewType>("grid");
  const [sort, setSort] = useState<string>("releaseDate-desc");
  const t = useTranslations();
  const { setItems } = useBreadcrumbs();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brand")?.split(",").filter(Boolean) || [],
  );

  const [selectedGenerations, setSelectedGenerations] = useState<string[]>(
    searchParams.get("generation")?.split(",").filter(Boolean) || [],
  );

  const [selectedModels, setSelectedModels] = useState<string[]>(
    searchParams.get("model")?.split(",").filter(Boolean) || [],
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type")?.split(",").filter(Boolean) || [],
  );
  const [selectedAllDigital, setSelectedAllDigital] = useState<boolean>(
    searchParams.get("allDigital") === "true",
  );

  const {
    data: consoleVariants,
    isLoading,
    error,
    isPlaceholderData,
  } = useConsoles({
    locale,
    page,
    perPage,
    sort,
    selectedBrands,
    selectedGenerations,
    selectedModels,
    selectedTypes,
    selectedAllDigital,
    searchQuery,
  });

  const SORT_OPTIONS: SortOption[] = [
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "releaseDate-asc", label: t("order.releaseDateAsc") },
    { value: "releaseDate-desc", label: t("order.releaseDateDesc") },
    { value: "popularity-desc", label: t("order.popularityDesc") },
  ];

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      generation: selectedGenerations.join(","),
      search: searchQuery,
      sort,
    });

    if (brands.length > 0) {
      params.set("brand", brands.join(","));
    }

    window.history.pushState({}, "", `/console-catalog?${params.toString()}`);
  };

  const handleGenerationChange = (generations: string[]) => {
    setSelectedGenerations(generations);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      brand: selectedBrands.join(","),
      search: searchQuery,
      sort,
    });

    if (generations.length > 0) {
      params.set("generation", generations.join(","));
    }

    window.history.pushState({}, "", `/console-catalog?${params.toString()}`);
  };

  const handleModelChange = (models: string[]) => {
    setSelectedModels(models);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      brand: selectedBrands.join(","),
      generation: selectedGenerations.join(","),
      search: searchQuery,
      sort,
    });

    if (models.length > 0) {
      params.set("model", models.join(","));
    }
    if (selectedAllDigital !== undefined) {
      params.set("allDigital", selectedAllDigital.toString());
    }

    window.history.pushState({}, "", `/console-catalog?${params.toString()}`);
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    updateURL({ type: types.join(",") });
  };

  const handleAllDigitalChange = (allDigital: boolean) => {
    setSelectedAllDigital(allDigital);
    updateURL({ allDigital: allDigital.toString() });
  };

  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      brand: selectedBrands.join(","),
      generation: selectedGenerations.join(","),
      model: selectedModels.join(","),
      type: selectedTypes.join(","),
      search: searchQuery,
      sort,
    });

    if (selectedAllDigital) {
      params.set("allDigital", "true");
    } else {
      params.delete("allDigital");
    }

    // Adicione os novos parâmetros
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    window.history.pushState({}, "", `/console-catalog?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedGenerations([]);
    setSelectedModels([]);
    setSelectedTypes([]);
    setSelectedAllDigital(false);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      search: searchQuery,
      sort,
    });

    window.history.pushState({}, "", `/console-catalog?${params.toString()}`);
  };

  useEffect(() => {
    const savedView = localStorage.getItem("catalog-view") as ViewType | null;
    if (savedView) {
      setView(savedView);
    }

    const savedSort = localStorage.getItem("catalog-sort");
    if (savedSort) {
      setSort(savedSort);
    }
  }, []);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    localStorage.setItem("catalog-sort", newSort);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      brand: selectedBrands.join(","),
      generation: selectedGenerations.join(","),
      search: searchQuery,
      sort: newSort,
    });

    window.history.pushState({}, "", `/console-catalog?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams({
      brand: selectedBrands.join(","),
      locale,
      generation: selectedGenerations.join(","),
      page: newPage.toString(),
      perPage: perPage.toString(),
      search: searchQuery,
      sort,
    });

    window.location.search = params.toString();
  };

  useEffect(() => {
    setItems([
      {
        label: t("Breadcrumbs.console-catalog"),
      },
    ]);

    return () => setItems([]);
  }, [setItems, t]);

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="flex flex-col lg:flex-row">
        {/* Skeleton para filtros */}
        <div className="hidden lg:block w-full lg:w-1/4 pr-4">
          <div className="sticky top-[70px]">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-1/2 mb-3" animated />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
                      <Skeleton className="h-4 w-3/4" animated />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-6 w-1/2 mb-3" animated />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
                      <Skeleton className="h-4 w-3/4" animated />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Skeleton className="h-10 w-full mt-4 rounded-md" animated />
          </div>
        </div>

        {/* Skeleton para conteúdo */}
        <div className="w-full">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex justify-end items-end gap-4 flex-1">
              <Skeleton className="h-10 w-32 rounded-md" animated />
              <div className="flex space-x-1">
                <Skeleton className="w-10 h-10 rounded-md" animated />
                <Skeleton className="w-10 h-10 rounded-md" animated />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ConsoleCardSkeleton key={i} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-full" animated />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Filtros para desktop */}
      <div className="hidden lg:block w-full lg:w-1/4 pr-4">
        <div className="sticky top-[70px] overflow-y-auto h-[calc(100vh-70px)] pe-2">
          <FilterContainer
            onBrandChange={handleBrandChange}
            onGenerationChange={handleGenerationChange}
            onModelChange={handleModelChange}
            onAllDigitalChange={handleAllDigitalChange}
            onTypeChange={handleTypeChange}
            selectedBrands={selectedBrands}
            selectedGenerations={selectedGenerations}
            selectedModels={selectedModels}
            selectedAllDigital={selectedAllDigital}
            selectedTypes={selectedTypes}
            clearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="w-full lg:w-3/4">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:w-auto flex-1">
            <SearchBar compact searchPath="/console-catalog" placeholder="Buscar consoles..." />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <SortSelect
              options={SORT_OPTIONS}
              value={sort}
              onChange={handleSortChange}
              className="w-full sm:w-auto"
            />
            <ViewToggle onViewChange={(newView) => setView(newView)} storageKey="catalog-view" />
          </div>
        </div>

        {/* Filtros para mobile */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between font-medium"
          >
            <span>{t("filters.label")}</span>
            <svg
              className={clsx(
                "w-5 h-5 transform transition-transform",
                showFilters ? "rotate-180" : "",
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
              <FilterContainer
                onBrandChange={handleBrandChange}
                onGenerationChange={handleGenerationChange}
                onModelChange={handleModelChange}
                onAllDigitalChange={handleAllDigitalChange}
                onTypeChange={handleTypeChange}
                selectedBrands={selectedBrands}
                selectedGenerations={selectedGenerations}
                selectedModels={selectedModels}
                selectedAllDigital={selectedAllDigital}
                selectedTypes={selectedTypes}
                clearFilters={clearFilters}
              />
            </div>
          )}
        </div>

        {error ? (
          <EmptyState
            title="Erro ao carregar dados"
            description={error.message}
            variant="card"
            size="lg"
            actionText="Tentar novamente"
            onAction={() => window.location.reload()}
          />
        ) : consoleVariants?.items && consoleVariants.items.length > 0 ? (
          <>
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col space-y-6"
              }
            >
              {consoleVariants.items.map((variant: ConsoleVariant) => (
                <ConsoleCard
                  key={variant.id}
                  name={variant.name}
                  consoleName={variant.consoleName}
                  brand={variant.brand.slug}
                  imageUrl={variant.imageUrl || "https://via.placeholder.com/150"}
                  description={variant.consoleDescription || ""}
                  slug={variant.slug}
                  orientation={view === "grid" ? "vertical" : "horizontal"}
                  variantId={variant.id}
                  isFavorite={variant.isFavorite}
                />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={consoleVariants.meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="Nenhum console encontrado"
            description="Tente ajustar seus filtros de busca"
            variant="card"
            size="lg"
            actionText="Limpar filtros"
            onAction={() => clearFilters()}
            actionVariant="outline"
            actionStatus="info"
          />
        )}
      </div>
    </div>
  );
};

export default ConsoleCatalogComponent;
