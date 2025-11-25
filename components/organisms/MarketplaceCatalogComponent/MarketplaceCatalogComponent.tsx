// components/organisms/MarketplaceCatalogComponent/MarketplaceCatalogComponent.tsx
"use client";

import { useTranslations } from "next-intl";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useMarketplace } from "@/hooks/useMarketplace";
import { MarketplaceItem } from "@/@types/catalog.types";
import { useCatalogState } from "@/hooks/useCatalogState";
import { useMarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import MarketplaceFilterContainer from "@/components/molecules/Filter/MarketplaceFilterContainer";
import MarketplaceCard from "@/components/molecules/MarketplaceCard/MarketplaceCard";
import MarketplaceMapView from "../MarketplaceMapView/MarketplaceMapView";
import { useEffect } from "react";
import { CatalogSkeleton } from "../Catalog/CatalogSkeleton";
import { CatalogEmptyState } from "../Catalog/CatalogEmptyState";
import { CatalogLayout } from "../Catalog/Layouts/CatalogLayout";
import { Grid3X3, List, Map } from "lucide-react";

interface MarketplaceCatalogComponentProps {
  perPage: number;
}

const MarketplaceCatalogComponent = ({ perPage }: MarketplaceCatalogComponentProps) => {
  const t = useTranslations();
  const { setItems } = useBreadcrumbs();

  // Estado do catálogo
  const catalogState = useCatalogState({
    storageKey: "marketplace-catalog",
    defaultViewMode: "grid",
    defaultSort: "recent",
    defaultPerPage: perPage,
  });

  // Filtros específicos de marketplace
  const marketplaceFilters = useMarketplaceFilters();

  // Buscar dados
  const {
    data: marketplace,
    isLoading,
    error,
    isPlaceholderData,
  } = useMarketplace({
    page: catalogState.page,
    perPage: catalogState.perPage,
    sort: catalogState.sort,
    searchQuery: catalogState.searchQuery,
    // General filters
    itemType: marketplaceFilters.selectedItemTypes,
    status: marketplaceFilters.selectedStatus,
    condition: marketplaceFilters.selectedConditions,
    priceMin: marketplaceFilters.priceMin,
    priceMax: marketplaceFilters.priceMax,
    hasBox: marketplaceFilters.hasBox,
    hasManual: marketplaceFilters.hasManual,
    acceptsTrade: marketplaceFilters.acceptsTrade,
    // Game filters
    platforms: marketplaceFilters.selectedPlatforms,
    genres: marketplaceFilters.selectedGenres,
    // Console filters
    brands: marketplaceFilters.selectedBrands,
    generations: marketplaceFilters.selectedGenerations,
    consoleModels: marketplaceFilters.selectedModels,
    consoleTypes: marketplaceFilters.selectedConsoleTypes,
    mediaFormats: marketplaceFilters.selectedMediaFormats,
    storageRanges: marketplaceFilters.selectedStorageRanges,
    allDigital: marketplaceFilters.allDigital,
    retroCompatible: marketplaceFilters.retroCompatible,
    // Accessory filters
    accessoryTypes: marketplaceFilters.selectedAccessoryTypes,
    accessorySubTypes: marketplaceFilters.selectedAccessorySubTypes,
    accessoryConsoles: marketplaceFilters.selectedConsoles,
  });

  // Opções de ordenação
  const SORT_OPTIONS = [
    { value: "recent", label: t("order.newestFirst") },
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "price-asc", label: t("order.priceAsc") },
    { value: "price-desc", label: t("order.priceDesc") },
    { value: "proximity", label: t("order.proximity") },
  ];

  // Opções de toggle para status
  const TOGGLE_ITEMS = [
    { value: "SELLING", label: "À venda" },
    { value: "LOOKING_FOR", label: "Procurando" },
  ];

  // Opções de visualização customizadas para marketplace
  const VIEW_MODE_OPTIONS = [
    { value: "grid" as const, label: "Grade", icon: <Grid3X3 size={16} /> },
    { value: "list" as const, label: "Lista", icon: <List size={16} /> },
    { value: "map" as const, label: "Mapa", icon: <Map size={16} /> },
  ];

  // Breadcrumbs
  useEffect(() => {
    setItems([
      {
        label: "Marketplace",
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
    if (!marketplace?.items || marketplace.items.length === 0) {
      return (
        <CatalogEmptyState
          title="Nenhum item encontrado"
          description="Tente ajustar sua busca ou filtros"
          onClearFilters={marketplaceFilters.clearFilters}
        />
      );
    }

    // Visualização em mapa
    if (catalogState.viewMode === "map") {
      return <MarketplaceMapView items={marketplace.items} />;
    }

    // Visualizações grid/list
    return (
      <div
        className={
          catalogState.viewMode === "grid"
            ? "grid grid-cols-2 xl:grid-cols-3 gap-6"
            : "flex flex-col space-y-6"
        }
      >
        {marketplace.items.map((item: MarketplaceItem) => (
          <MarketplaceCard key={`${item.itemType}-${item.id}`} item={item} />
        ))}
      </div>
    );
  };

  return (
    <CatalogLayout
      // Header
      searchPlaceholder="Buscar itens..."
      searchPath="/marketplace"
      sortOptions={SORT_OPTIONS}
      toggleItems={TOGGLE_ITEMS}
      toggleValue={marketplaceFilters.selectedStatus}
      onToggleChange={marketplaceFilters.handleStatusChange}
      viewModeOptions={VIEW_MODE_OPTIONS}
      // Filtros
      filterSidebar={
        <MarketplaceFilterContainer
          onItemTypeChange={marketplaceFilters.handleItemTypeChange}
          onConditionChange={marketplaceFilters.handleConditionChange}
          selectedItemTypes={marketplaceFilters.selectedItemTypes}
          selectedConditions={marketplaceFilters.selectedConditions}
          clearFilters={marketplaceFilters.clearFilters}
          // General filters
          priceMin={marketplaceFilters.priceMin}
          priceMax={marketplaceFilters.priceMax}
          hasBox={marketplaceFilters.hasBox}
          hasManual={marketplaceFilters.hasManual}
          acceptsTrade={marketplaceFilters.acceptsTrade}
          onPriceMinChange={marketplaceFilters.handlePriceMinChange}
          onPriceMaxChange={marketplaceFilters.handlePriceMaxChange}
          onHasBoxChange={marketplaceFilters.handleHasBoxChange}
          onHasManualChange={marketplaceFilters.handleHasManualChange}
          onAcceptsTradeChange={marketplaceFilters.handleAcceptsTradeChange}
          // Game filters
          selectedGenres={marketplaceFilters.selectedGenres}
          selectedPlatforms={marketplaceFilters.selectedPlatforms}
          onGenreChange={marketplaceFilters.handleGenreChange}
          onPlatformChange={marketplaceFilters.handlePlatformChange}
          // Console filters
          selectedBrands={marketplaceFilters.selectedBrands}
          selectedGenerations={marketplaceFilters.selectedGenerations}
          selectedModels={marketplaceFilters.selectedModels}
          selectedConsoleTypes={marketplaceFilters.selectedConsoleTypes}
          selectedMediaFormats={marketplaceFilters.selectedMediaFormats}
          selectedStorageRanges={marketplaceFilters.selectedStorageRanges}
          allDigital={marketplaceFilters.allDigital}
          retroCompatible={marketplaceFilters.retroCompatible}
          onBrandChange={marketplaceFilters.handleBrandChange}
          onGenerationChange={marketplaceFilters.handleGenerationChange}
          onModelChange={marketplaceFilters.handleModelChange}
          onConsoleTypeChange={marketplaceFilters.handleConsoleTypeChange}
          onMediaFormatChange={marketplaceFilters.handleMediaFormatChange}
          onStorageChange={marketplaceFilters.handleStorageChange}
          onAllDigitalChange={marketplaceFilters.handleAllDigitalChange}
          onRetroCompatibleChange={marketplaceFilters.handleRetroCompatibleChange}
          // Accessory filters
          selectedAccessoryTypes={marketplaceFilters.selectedAccessoryTypes}
          selectedAccessorySubTypes={marketplaceFilters.selectedAccessorySubTypes}
          selectedConsoles={marketplaceFilters.selectedConsoles}
          onAccessoryTypeChange={marketplaceFilters.handleAccessoryTypeChange}
          onAccessorySubTypeChange={marketplaceFilters.handleAccessorySubTypeChange}
          onConsoleChange={marketplaceFilters.handleConsoleChange}
        />
      }
      filterDrawer={
        <MarketplaceFilterContainer
          onItemTypeChange={marketplaceFilters.handleItemTypeChange}
          onConditionChange={marketplaceFilters.handleConditionChange}
          selectedItemTypes={marketplaceFilters.selectedItemTypes}
          selectedConditions={marketplaceFilters.selectedConditions}
          clearFilters={marketplaceFilters.clearFilters}
          // General filters
          priceMin={marketplaceFilters.priceMin}
          priceMax={marketplaceFilters.priceMax}
          hasBox={marketplaceFilters.hasBox}
          hasManual={marketplaceFilters.hasManual}
          acceptsTrade={marketplaceFilters.acceptsTrade}
          onPriceMinChange={marketplaceFilters.handlePriceMinChange}
          onPriceMaxChange={marketplaceFilters.handlePriceMaxChange}
          onHasBoxChange={marketplaceFilters.handleHasBoxChange}
          onHasManualChange={marketplaceFilters.handleHasManualChange}
          onAcceptsTradeChange={marketplaceFilters.handleAcceptsTradeChange}
          // Game filters
          selectedGenres={marketplaceFilters.selectedGenres}
          selectedPlatforms={marketplaceFilters.selectedPlatforms}
          onGenreChange={marketplaceFilters.handleGenreChange}
          onPlatformChange={marketplaceFilters.handlePlatformChange}
          // Console filters
          selectedBrands={marketplaceFilters.selectedBrands}
          selectedGenerations={marketplaceFilters.selectedGenerations}
          selectedModels={marketplaceFilters.selectedModels}
          selectedConsoleTypes={marketplaceFilters.selectedConsoleTypes}
          selectedMediaFormats={marketplaceFilters.selectedMediaFormats}
          selectedStorageRanges={marketplaceFilters.selectedStorageRanges}
          allDigital={marketplaceFilters.allDigital}
          retroCompatible={marketplaceFilters.retroCompatible}
          onBrandChange={marketplaceFilters.handleBrandChange}
          onGenerationChange={marketplaceFilters.handleGenerationChange}
          onModelChange={marketplaceFilters.handleModelChange}
          onConsoleTypeChange={marketplaceFilters.handleConsoleTypeChange}
          onMediaFormatChange={marketplaceFilters.handleMediaFormatChange}
          onStorageChange={marketplaceFilters.handleStorageChange}
          onAllDigitalChange={marketplaceFilters.handleAllDigitalChange}
          onRetroCompatibleChange={marketplaceFilters.handleRetroCompatibleChange}
          // Accessory filters
          selectedAccessoryTypes={marketplaceFilters.selectedAccessoryTypes}
          selectedAccessorySubTypes={marketplaceFilters.selectedAccessorySubTypes}
          selectedConsoles={marketplaceFilters.selectedConsoles}
          onAccessoryTypeChange={marketplaceFilters.handleAccessoryTypeChange}
          onAccessorySubTypeChange={marketplaceFilters.handleAccessorySubTypeChange}
          onConsoleChange={marketplaceFilters.handleConsoleChange}
        />
      }
      // Conteúdo
      content={renderContent()}
      emptyState={null} // Já tratamos no renderContent
      loadingState={null} // Já tratamos acima
      // Paginação
      pagination={
        marketplace?.meta
          ? {
              currentPage: catalogState.page,
              totalPages: marketplace.meta.totalPages,
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

export default MarketplaceCatalogComponent;
