"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import { ConsoleVariantsResponse } from "@/@types/console";
import FilterContainer from "@/components/molecules/Filter/Filter";
import ConsoleCard from "@/components/molecules/ConsoleCard/ConsoleCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { EmptyState } from "@/components/atoms/EmptyState/EmptyState";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { ConsoleCardSkeleton } from "@/components/molecules/ConsoleCard/ConsoleCard.skeleton";

interface CatalogComponentProps {
  brand: string;
  locale: string;
  page: number;
  perPage: number;
}

const CatalogComponent = ({ locale, page, perPage }: CatalogComponentProps) => {
  const [consoleVariants, setConsoleVariants] = useState<ConsoleVariantsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState<number>(1);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
    setPageLoading(true);
    window.history.pushState(
      {},
      "",
      `?brand=${brands.join(",")}&locale=${locale}&generation=${selectedGenerations.join(",")}&page=1&perPage=${perPage}`,
    );
  };

  const handleGenerationChange = (generations: string[]) => {
    setSelectedGenerations(generations);
    setPageLoading(true);
    window.history.pushState(
      {},
      "",
      `?brand=${selectedBrands.join(",")}&locale=${locale}&generation=${generations.join(",")}&page=1&perPage=${perPage}`,
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedGenerations([]);
    setPageLoading(true);
    window.history.pushState({}, "", `?locale=${locale}&page=1&perPage=${perPage}`);
  };

  useEffect(() => {
    const fetchConsoleVariants = async () => {
      try {
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
        setPageLoading(false);
      }
    };

    fetchConsoleVariants();
  }, [selectedBrands, selectedGenerations, locale, page, perPage]);

  const handlePageChange = (newPage: number) => {
    setPageLoading(true);
    window.location.search = `?brand=${selectedBrands.join(",")}&locale=${locale}&generation=${selectedGenerations.join(",")}&page=${newPage}&perPage=${perPage}`;
  };

  // Renderização do estado de loading inicial
  if (loading) {
    return (
      <div className="flex">
        <div className="w-1/4 pr-4">
          <div className="sticky top-4">
            {/* Skeleton para filtros */}
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

        <div className="w-3/4">
          <div className="grid grid-cols-3 gap-4">
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
    <div className="flex">
      <div className="w-1/4 pr-4">
        <div className="sticky top-4">
          <FilterContainer
            onBrandChange={handleBrandChange}
            onGenerationChange={handleGenerationChange}
            selectedBrands={selectedBrands}
            selectedGenerations={selectedGenerations}
          />
          <button
            onClick={clearFilters}
            className="w-full mt-4 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="w-3/4">
        {error ? (
          <div className="text-center py-12">
            <EmptyState
              title="Erro ao carregar dados"
              description={error}
              variant="card"
              size="lg"
              actionText="Tentar novamente"
              onAction={() => window.location.reload()}
            />
          </div>
        ) : pageLoading ? (
          // Loading durante troca de página/filtro
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <ConsoleCardSkeleton key={i} />
            ))}
          </div>
        ) : consoleVariants && consoleVariants.items.length > 0 ? (
          // Conteúdo carregado com dados
          <>
            <div className="grid grid-cols-3 gap-4">
              {consoleVariants.items.map((variant) => (
                <ConsoleCard
                  key={variant.id}
                  name={variant.name}
                  consoleName={variant.consoleName}
                  brand={variant.brand.slug}
                  imageUrl={variant.imageUrl || "https://via.placeholder.com/150"}
                  description={"variant.description"}
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
