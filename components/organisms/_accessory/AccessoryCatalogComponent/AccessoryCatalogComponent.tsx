// components/organisms/_accessory/AccessoryCatalogComponent/AccessoryCatalogComponent.tsx
"use client";

import { useState, useEffect } from "react";
import AccessoryCard from "@/components/molecules/_accessory/AccessoryCard/AccessoryCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { EmptyState } from "@/components/atoms/EmptyState/EmptyState";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { AccessoryCardSkeleton } from "@/components/molecules/_accessory/AccessoryCard/AccessoryCard.skeleton";
import { ViewToggle, ViewType } from "@/components/molecules/ViewToggle/ViewToggle";
import { SortOption, SortSelect } from "@/components/molecules/SortSelect/SortSelect";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useAccessories } from "@/hooks/useAccessories";
import { Accessory } from "@/@types/catalog.types";
import AccessoryFilterContainer from "@/components/molecules/Filter/AccessoryFilterContainer";

interface AccessoryCatalogComponentProps {
  locale: string;
  page: number;
  perPage: number;
}

const AccessoryCatalogComponent = ({ locale, page, perPage }: AccessoryCatalogComponentProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<ViewType>("grid");
  const [sort, setSort] = useState<string>("name-asc");
  const t = useTranslations();
  const { setItems } = useBreadcrumbs();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type")?.split(",").filter(Boolean) || [],
  );
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>(
    searchParams.get("subType")?.split(",").filter(Boolean) || [],
  );
  const [selectedConsoles, setSelectedConsoles] = useState<string[]>(
    searchParams.get("console")?.split(",").filter(Boolean) || [],
  );

  const {
    data: accessories,
    isLoading,
    error,
    isPlaceholderData,
  } = useAccessories({
    locale,
    page,
    perPage,
    sort,
    selectedTypes,
    selectedSubTypes,
    selectedConsoles,
    searchQuery,
  });

  const SORT_OPTIONS: SortOption[] = [
    { value: "name-asc", label: t("order.nameAsc") },
    { value: "name-desc", label: t("order.nameDesc") },
    { value: "releaseDate-asc", label: t("order.releaseDateAsc") },
    { value: "releaseDate-desc", label: t("order.releaseDateDesc") },
  ];

  // Handlers para mudanças de filtro
  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    updateURL({ type: types.join(",") });
  };

  const handleSubTypeChange = (subTypes: string[]) => {
    setSelectedSubTypes(subTypes);
    updateURL({ subType: subTypes.join(",") });
  };

  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      search: searchQuery,
      sort,
    });

    // Adicionar filtros se existirem
    if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","));
    if (selectedSubTypes.length > 0) params.set("subType", selectedSubTypes.join(","));
    if (selectedConsoles.length > 0) params.set("console", selectedConsoles.join(","));

    // Adicionar novos parâmetros
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    window.history.pushState({}, "", `/accessory-catalog?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedSubTypes([]);
    setSelectedConsoles([]);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      search: searchQuery,
      sort,
    });

    window.history.pushState({}, "", `/accessory-catalog?${params.toString()}`);
  };

  useEffect(() => {
    const savedView = localStorage.getItem("accessory-catalog-view") as ViewType | null;
    if (savedView) {
      setView(savedView);
    }

    const savedSort = localStorage.getItem("accessory-catalog-sort");
    if (savedSort) {
      setSort(savedSort);
    }
  }, []);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    localStorage.setItem("accessory-catalog-sort", newSort);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      search: searchQuery,
      sort: newSort,
    });

    // Manter filtros ativos
    if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","));
    if (selectedSubTypes.length > 0) params.set("subType", selectedSubTypes.join(","));
    if (selectedConsoles.length > 0) params.set("console", selectedConsoles.join(","));

    window.history.pushState({}, "", `/accessory-catalog?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams({
      locale,
      page: newPage.toString(),
      perPage: perPage.toString(),
      search: searchQuery,
      sort,
    });

    // Manter filtros ativos
    if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","));
    if (selectedSubTypes.length > 0) params.set("subType", selectedSubTypes.join(","));
    if (selectedConsoles.length > 0) params.set("console", selectedConsoles.join(","));

    window.location.search = params.toString();
  };

  useEffect(() => {
    setItems([
      {
        label: t("Breadcrumbs.accessory-catalog"),
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
              <AccessoryCardSkeleton key={i} />
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
          <AccessoryFilterContainer
            selectedTypes={selectedTypes}
            selectedSubTypes={selectedSubTypes}
            onTypeChange={handleTypeChange}
            onSubTypeChange={handleSubTypeChange}
            clearFilters={clearFilters}
            locale={locale}
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="w-full lg:w-3/4">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:w-auto flex-1">
            <SearchBar compact searchPath="/accessory-catalog" placeholder="Buscar acessórios..." />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <SortSelect
              options={SORT_OPTIONS}
              value={sort}
              onChange={handleSortChange}
              className="w-full sm:w-auto"
            />
            <ViewToggle
              onViewChange={(newView) => setView(newView)}
              storageKey="accessory-catalog-view"
            />
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
              <AccessoryFilterContainer
                selectedTypes={selectedTypes}
                selectedSubTypes={selectedSubTypes}
                onTypeChange={handleTypeChange}
                onSubTypeChange={handleSubTypeChange}
                clearFilters={clearFilters}
                locale={locale}
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
        ) : accessories?.items && accessories.items.length > 0 ? (
          <>
            <div
              className={
                view === "grid"
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
                  orientation={view === "grid" ? "vertical" : "horizontal"}
                  isFavorite={accessory.isFavorite}
                />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={accessories.meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="Nenhum acessório encontrado"
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

export default AccessoryCatalogComponent;
