// components/organisms/ConsoleCatalogComponent/ConsoleCatalogComponent.tsx
"use client";

import { useTranslations } from "next-intl";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useConsoles } from "@/hooks/useConsoles";
import { ConsoleVariant } from "@/@types/catalog.types";
import { useCatalogState } from "@/hooks/useCatalogState";
import { useConsoleFilters } from "@/hooks/useConsoleFilters";
import ConsoleFilterContainer from "@/components/molecules/Filter/ConsoleFilterContainer";
import ConsoleCard from "@/components/molecules/_console/ConsoleCard/ConsoleCard";
import { useEffect } from "react";
import { CatalogSkeleton } from "../../Catalog/CatalogSkeleton";
import { CatalogEmptyState } from "../../Catalog/CatalogEmptyState";
import { CatalogLayout } from "../../Catalog/Layouts/CatalogLayout";

interface ConsoleCatalogComponentProps {
  locale: string;
  perPage: number;
}

const ConsoleCatalogComponent = ({ locale, perPage }: ConsoleCatalogComponentProps) => {
  const t = useTranslations();
  const { setItems } = useBreadcrumbs();

  // Estado do catálogo
  const catalogState = useCatalogState({
    storageKey: "console-catalog",
    defaultViewMode: "grid",
    defaultSort: "releaseDate-desc",
    defaultPerPage: perPage,
  });

  // Filtros específicos de consoles
  const consoleFilters = useConsoleFilters();

  // Buscar dados
  const {
    data: consoleVariants,
    isLoading,
    error,
    isPlaceholderData,
  } = useConsoles({
    locale,
    page: catalogState.page,
    perPage: catalogState.perPage,
    sort: catalogState.sort,
    selectedBrands: consoleFilters.selectedBrands,
    selectedGenerations: consoleFilters.selectedGenerations,
    selectedModels: consoleFilters.selectedModels,
    selectedTypes: consoleFilters.selectedTypes,
    selectedAllDigital: consoleFilters.selectedAllDigital,
    searchQuery: catalogState.searchQuery,
    selectedMediaFormats: consoleFilters.selectedMediaFormats,
    retroCompatible: consoleFilters.retroCompatible,
    storageRanges: consoleFilters.selectedStorageRanges,
  });

  // Opções de ordenação
  const SORT_OPTIONS = [
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "releaseDate-asc", label: t("order.releaseDateAsc") },
    { value: "releaseDate-desc", label: t("order.releaseDateDesc") },
    { value: "popularity-desc", label: t("order.popularityDesc") },
  ];

  // Breadcrumbs
  useEffect(() => {
    setItems([
      {
        label: t("Breadcrumbs.console-catalog"),
      },
    ]);

    return () => setItems([]);
  }, [setItems, t]);

  // Loading state
  if (isLoading && !isPlaceholderData) {
    return <CatalogSkeleton itemCount={6} />;
  }

  // Error state
  if (error) {
    return (
      <CatalogEmptyState
        title="Erro ao carregar dados"
        description={error.message}
        actionText="Tentar novamente"
        onClearFilters={() => window.location.reload()}
      />
    );
  }

  // Conteúdo principal
  const renderContent = () => {
    if (!consoleVariants?.items || consoleVariants.items.length === 0) {
      return (
        <CatalogEmptyState
          title="Nenhum console encontrado"
          description="Tente ajustar seus filtros de busca"
          onClearFilters={consoleFilters.clearFilters}
        />
      );
    }

    return (
      <div className="relative">
        {/* Loading overlay quando filtros são aplicados */}
        {isPlaceholderData && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Aplicando filtros...
              </p>
            </div>
          </div>
        )}

        <div
          className={
            catalogState.viewMode === "grid"
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
              orientation={catalogState.viewMode === "grid" ? "vertical" : "horizontal"}
              variantId={variant.id}
              isFavorite={variant.isFavorite}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <CatalogLayout
      // Header
      searchPlaceholder="Buscar consoles..."
      searchPath="/console-catalog"
      sortOptions={SORT_OPTIONS}
      // Filtros
      filterSidebar={
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
          selectedAllDigital={consoleFilters.selectedAllDigital}
          selectedTypes={consoleFilters.selectedTypes}
          selectedModels={consoleFilters.selectedModels}
          selectedMediaFormats={consoleFilters.selectedMediaFormats}
          retroCompatible={consoleFilters.retroCompatible}
          clearFilters={consoleFilters.clearFilters}
        />
      }
      filterDrawer={
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
          selectedAllDigital={consoleFilters.selectedAllDigital}
          selectedTypes={consoleFilters.selectedTypes}
          selectedModels={consoleFilters.selectedModels}
          selectedMediaFormats={consoleFilters.selectedMediaFormats}
          retroCompatible={consoleFilters.retroCompatible}
          clearFilters={consoleFilters.clearFilters}
        />
      }
      // Conteúdo
      content={renderContent()}
      emptyState={null}
      loadingState={null}
      // Paginação
      pagination={
        consoleVariants?.meta
          ? {
              currentPage: catalogState.page,
              totalPages: consoleVariants.meta.totalPages,
              onPageChange: catalogState.setPage,
            }
          : undefined
      }
      // Estados
      viewMode={catalogState.viewMode}
      onViewModeChange={catalogState.setViewMode}
      sort={catalogState.sort}
      onSortChange={catalogState.setSort}
      isFilterDrawerOpen={catalogState.isFilterDrawerOpen}
      onFilterDrawerToggle={catalogState.setFilterDrawerOpen}
    />
  );
};

export default ConsoleCatalogComponent;
