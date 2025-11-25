// components/catalog/layouts/CatalogLayout.tsx
"use client";

import { Drawer } from "@/components/atoms/Drawer/Drawer";
import { CatalogHeader } from "./CatalogHeader";
import { CatalogLayoutProps } from "@/@types/catalog-state.types";
import Pagination from "@/components/molecules/Pagination/Pagination";

export const CatalogLayout = ({
  // Header
  searchPlaceholder,
  searchPath,
  sortOptions,
  toggleItems,
  toggleValue,
  onToggleChange,

  // Filtros
  filterSidebar,
  filterDrawer,

  // Conteúdo
  content,
  loadingState,

  // Paginação
  pagination,

  // Estados
  viewMode,
  onViewModeChange,
  sort,
  onSortChange,
  isFilterDrawerOpen,
  onFilterDrawerToggle,
}: CatalogLayoutProps) => {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Filtros para desktop */}
      <div className="hidden lg:block w-full lg:w-1/4 pr-4">
        <div className="sticky top-[70px] overflow-y-auto h-[calc(100vh-70px)] pe-2">
          {filterSidebar}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="w-full lg:w-3/4">
        {/* Header com controles */}
        <CatalogHeader
          searchPlaceholder={searchPlaceholder}
          searchPath={searchPath}
          sortOptions={sortOptions}
          sort={sort}
          onSortChange={onSortChange}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          onFilterToggle={() => onFilterDrawerToggle(true)}
          showFilterButton={true}
          toggleItems={toggleItems}
          toggleValue={toggleValue}
          onToggleChange={onToggleChange}
        />

        {/* Drawer de Filtros para Mobile */}
        <Drawer
          open={isFilterDrawerOpen}
          onClose={() => onFilterDrawerToggle(false)}
          title="Filtrar"
          anchor="right"
          className="w-full max-w-md"
        >
          {filterDrawer}
        </Drawer>

        {/* Conteúdo */}
        {loadingState || content}

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
