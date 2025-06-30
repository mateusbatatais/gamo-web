"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import { ConsoleVariantsResponse } from "@/@types/console";
import FilterContainer from "@/components/molecules/Filter/Filter";
import ConsoleCard from "@/components/molecules/ConsoleCard/ConsoleCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { EmptyState } from "@/components/atoms/EmptyState/EmptyState";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import clsx from "clsx";
import { ConsoleCardSkeleton } from "@/components/molecules/ConsoleCard/ConsoleCard.skeleton";

interface CatalogComponentProps {
  locale: string;
  page: number;
  perPage: number;
}

const CatalogComponent = ({ locale, page, perPage }: CatalogComponentProps) => {
  const [consoleVariants, setConsoleVariants] = useState<ConsoleVariantsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brand")?.split(",").filter(Boolean) || [],
  );

  const [selectedGenerations, setSelectedGenerations] = useState<string[]>(
    searchParams.get("generation")?.split(",").filter(Boolean) || [],
  );

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
    setLoading(true);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      generation: selectedGenerations.join(","),
      search: searchQuery,
    });

    if (brands.length > 0) {
      params.set("brand", brands.join(","));
    }

    window.history.pushState({}, "", `/catalog?${params.toString()}`);
  };

  const handleGenerationChange = (generations: string[]) => {
    setSelectedGenerations(generations);
    setLoading(true);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      brand: selectedBrands.join(","),
      search: searchQuery,
    });

    if (generations.length > 0) {
      params.set("generation", generations.join(","));
    }

    window.history.pushState({}, "", `/catalog?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedGenerations([]);
    setLoading(true);

    const params = new URLSearchParams({
      locale,
      page: "1",
      perPage: perPage.toString(),
      search: searchQuery,
    });

    window.history.pushState({}, "", `/catalog?${params.toString()}`);
  };

  useEffect(() => {
    const fetchConsoleVariants = async () => {
      try {
        setLoading(true);
        setLoading(true);

        const params = new URLSearchParams({
          locale,
          page: page.toString(),
          perPage: perPage.toString(),
        });

        if (selectedBrands.length > 0) {
          params.append("brand", selectedBrands.join(","));
        }

        if (selectedGenerations.length > 0) {
          params.append("generation", selectedGenerations.join(","));
        }

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const data: ConsoleVariantsResponse = await apiFetch(`/consoles?${params.toString()}`);
        setConsoleVariants(data);
        setTotalPages(data.meta.totalPages);
        setError("");
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An error occurred while fetching the console variants.");
        }
      } finally {
        setLoading(false);
        setLoading(false);
      }
    };

    fetchConsoleVariants();
  }, [selectedBrands, selectedGenerations, locale, page, perPage, searchQuery]);

  const handlePageChange = (newPage: number) => {
    setLoading(true);

    const params = new URLSearchParams({
      brand: selectedBrands.join(","),
      locale,
      generation: selectedGenerations.join(","),
      page: newPage.toString(),
      perPage: perPage.toString(),
      search: searchQuery,
    });

    window.location.search = params.toString();
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:block w-full lg:w-1/4 pr-4">
          <div className="sticky top-[70px] ">
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
          <div className="mb-6">
            <Skeleton className="h-12 w-full rounded-lg" animated />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
      <div className="hidden lg:block w-full lg:w-1/4 pr-4">
        <div className="sticky top-[70px]">
          <FilterContainer
            onBrandChange={handleBrandChange}
            onGenerationChange={handleGenerationChange}
            selectedBrands={selectedBrands}
            selectedGenerations={selectedGenerations}
            clearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="w-full lg:w-3/4">
        {/* Barra de busca */}
        <div className="mb-6">
          <SearchBar variant="page" />
        </div>

        {/* Filtros para mobile */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between font-medium"
          >
            <span>Filtros</span>
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
                selectedBrands={selectedBrands}
                selectedGenerations={selectedGenerations}
                clearFilters={clearFilters}
              />
            </div>
          )}
        </div>

        {error ? (
          <EmptyState
            title="Erro ao carregar dados"
            description={error}
            variant="card"
            size="lg"
            actionText="Tentar novamente"
            onAction={() => window.location.reload()}
          />
        ) : consoleVariants && consoleVariants.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {consoleVariants.items.map((variant) => (
                <ConsoleCard
                  key={variant.id}
                  loading={loading}
                  name={variant.name}
                  consoleName={variant.consoleName}
                  brand={variant.brand.slug}
                  imageUrl={variant.imageUrl || "https://via.placeholder.com/150"}
                  description={variant.consoleDescription || "Descrição não disponível"}
                  slug={variant.slug}
                />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
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

export default CatalogComponent;
