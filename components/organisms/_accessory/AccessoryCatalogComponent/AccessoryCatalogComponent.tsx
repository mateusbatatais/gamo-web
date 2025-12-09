// components/organisms/_accessory/AccessoryCatalogComponent/AccessoryCatalogComponent.tsx
"use client";

import { useTranslations } from "next-intl";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useAccessories } from "@/hooks/useAccessories";
import { Accessory } from "@/@types/catalog.types";
import { useCatalogState } from "@/hooks/useCatalogState";
import { useAccessoryFilters } from "@/hooks/useAccessoryFilters";
import AccessoryFilterContainer from "@/components/molecules/Filter/AccessoryFilterContainer";
import AccessoryCard from "@/components/molecules/_accessory/AccessoryCard/AccessoryCard";
import { useEffect } from "react";
import { CatalogSkeleton } from "../../Catalog/CatalogSkeleton";
import { CatalogEmptyState } from "../../Catalog/CatalogEmptyState";
import { CatalogLayout } from "../../Catalog/Layouts/CatalogLayout";

interface AccessoryCatalogComponentProps {
  locale: string;
  perPage: number;
}

const AccessoryCatalogComponent = ({ locale, perPage }: AccessoryCatalogComponentProps) => {
  const t = useTranslations();
  const { setItems } = useBreadcrumbs();

  // Estado do catálogo
  const catalogState = useCatalogState({
    storageKey: "accessory-catalog",
    defaultViewMode: "grid",
    defaultSort: "name-asc",
    defaultPerPage: perPage,
  });

  // Filtros específicos de acessórios
  const accessoryFilters = useAccessoryFilters();

  // Buscar dados
  const {
    data: accessories,
    isLoading,
    error,
    isPlaceholderData,
  } = useAccessories({
    locale,
    page: catalogState.page,
    perPage: catalogState.perPage,
    sort: catalogState.sort,
    selectedTypes: accessoryFilters.selectedTypes,
    selectedSubTypes: accessoryFilters.selectedSubTypes,
    selectedConsoles: accessoryFilters.selectedConsoles,
    searchQuery: catalogState.searchQuery,
  });

  // Opções de ordenação
  const SORT_OPTIONS = [
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "releaseDate-asc", label: t("order.releaseDateAsc") },
    { value: "releaseDate-desc", label: t("order.releaseDateDesc") },
  ];

  // Breadcrumbs
  useEffect(() => {
    setItems([
      {
        label: t("Breadcrumbs.accessory-catalog"),
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
    if (!accessories?.items || accessories.items.length === 0) {
      return (
        <CatalogEmptyState
          title="Nenhum acessório encontrado"
          description="Tente ajustar seus filtros de busca"
          onClearFilters={accessoryFilters.clearFilters}
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
          {accessories.items.map((accessory: Accessory) => (
            <AccessoryCard
              key={accessory.id}
              id={accessory.id}
              name={accessory.name}
              type={accessory.type}
              subType={accessory.subType}
              imageUrl={accessory.imageUrl || "https://via.placeholder.com/150"}
              slug={accessory.slug}
              orientation={catalogState.viewMode === "grid" ? "vertical" : "horizontal"}
              isFavorite={accessory.isFavorite}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <CatalogLayout
      // Header
      searchPlaceholder="Buscar acessórios..."
      searchPath="/accessory-catalog"
      sortOptions={SORT_OPTIONS}
      // Filtros
      filterSidebar={
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
      }
      filterDrawer={
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
      }
      // Conteúdo
      content={renderContent()}
      emptyState={null}
      loadingState={null}
      // Paginação
      pagination={
        accessories?.meta
          ? {
              currentPage: catalogState.page,
              totalPages: accessories.meta.totalPages,
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

export default AccessoryCatalogComponent;
