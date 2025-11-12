// components/organisms/ConsoleCatalogComponent/ConsoleCatalogComponent.tsx
"use client";

import { useState, useEffect } from "react";
import ConsoleFilterContainer from "@/components/molecules/Filter/ConsoleFilterContainer";
import ConsoleCard from "@/components/molecules/_console/ConsoleCard/ConsoleCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { EmptyState } from "@/components/atoms/EmptyState/EmptyState";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { useSearchParams } from "next/navigation";
import { ConsoleCardSkeleton } from "@/components/molecules/_console/ConsoleCard/ConsoleCard.skeleton";
import { ViewToggle, ViewType } from "@/components/molecules/ViewToggle/ViewToggle";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useConsoles } from "@/hooks/useConsoles";
import { ConsoleVariant } from "@/@types/catalog.types";
import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { Button } from "@/components/atoms/Button/Button";
import { Settings2 } from "lucide-react";

interface ConsoleCatalogComponentProps {
  locale: string;
  page: number;
  perPage: number;
}

const ConsoleCatalogComponent = ({ locale, page, perPage }: ConsoleCatalogComponentProps) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
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

  const [selectedMediaFormats, setSelectedMediaFormats] = useState<string[]>(
    searchParams.get("mediaFormats")?.split(",").filter(Boolean) || [],
  );
  const [retroCompatible, setRetroCompatible] = useState<boolean>(
    searchParams.get("retroCompatible") === "true",
  );

  const [selectedStorageRanges, setSelectedStorageRanges] = useState<string[]>(
    searchParams.get("storage")?.split(",").filter(Boolean) || [],
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
    selectedMediaFormats,
    retroCompatible,
    storageRanges: selectedStorageRanges,
  });

  const SORT_OPTIONS: SortOption[] = [
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "releaseDate-asc", label: t("order.releaseDateAsc") },
    { value: "releaseDate-desc", label: t("order.releaseDateDesc") },
    { value: "popularity-desc", label: t("order.popularityDesc") },
  ];

  const handleStorageChange = (ranges: string[]) => {
    setSelectedStorageRanges(ranges);
    updateURL({ storage: ranges.join(",") });
  };

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

    if (selectedMediaFormats.length > 0) {
      params.set("mediaFormats", selectedMediaFormats.join(","));
    } else {
      params.delete("mediaFormats");
    }
    if (retroCompatible) {
      params.set("retroCompatible", "true");
    } else {
      params.delete("retroCompatible");
    }

    if (selectedStorageRanges.length > 0) {
      params.set("storage", selectedStorageRanges.join(","));
    } else {
      params.delete("storage");
    }

    // Adicione os novos parâmetros do newParams
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    window.history.pushState({}, "", `/console-catalog?${params.toString()}`);
  };

  const handleMediaFormatChange = (formats: string[]) => {
    setSelectedMediaFormats(formats);
    updateURL({ mediaFormats: formats.join(",") });
  };

  const handleRetroCompatibleChange = (isRetroCompatible: boolean) => {
    setRetroCompatible(isRetroCompatible);
    updateURL({ retroCompatible: isRetroCompatible.toString() });
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
          <ConsoleFilterContainer
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
            selectedAllDigital={selectedAllDigital}
            selectedTypes={selectedTypes}
            selectedModels={selectedModels}
            selectedMediaFormats={selectedMediaFormats}
            retroCompatible={retroCompatible}
            clearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="w-full lg:w-3/4">
        {/* Header com controles - REVISADO */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Searchbar - 100% em lg */}
          <div className="w-full lg:flex-1">
            <SearchBar compact searchPath="/console-catalog" placeholder="Buscar consoles..." />
          </div>

          {/* Grupo de controles - reorganizado por breakpoint */}
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* SortSelect - em md: 100%, em lg: normal */}
            <div className="w-full md:w-full lg:w-auto">
              <SortSelect
                options={SORT_OPTIONS}
                value={sort}
                onChange={handleSortChange}
                className="w-full lg:w-auto"
              />
            </div>

            {/* Demais controles - linha em lg, empilhados em md */}
            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-between lg:justify-end">
              <ViewToggle onViewChange={(newView) => setView(newView)} storageKey="catalog-view" />

              {/* Botão de filtros - visível apenas em mobile */}
              <div className="lg:hidden">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  icon={<Settings2 size={16} />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer de Filtros para Mobile */}
        <Drawer
          open={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title="Filtrar Consoles"
          anchor="right"
          className="w-full max-w-md"
        >
          <ConsoleFilterContainer
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
            selectedAllDigital={selectedAllDigital}
            selectedTypes={selectedTypes}
            selectedModels={selectedModels}
            selectedMediaFormats={selectedMediaFormats}
            retroCompatible={retroCompatible}
            clearFilters={clearFilters}
          />
        </Drawer>

        {error ? (
          <EmptyState
            data-testid="empty-state"
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
