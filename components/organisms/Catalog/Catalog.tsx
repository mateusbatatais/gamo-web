"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api"; // Importando a função apiFetch
import { ConsoleVariantsResponse } from "@/@types/console";
import FilterContainer from "@/components/molecules/Filter/Filter"; // Agora usamos o FilterContainer
import ConsoleCard from "@/components/molecules/ConsoleCard/ConsoleCard";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { EmptyState } from "@/components/atoms/EmptyState/EmptyState";

interface CatalogComponentProps {
  brand: string;
  locale: string;
  page: number;
  perPage: number;
}

const CatalogComponent = ({ locale, page, perPage }: CatalogComponentProps) => {
  const [consoleVariants, setConsoleVariants] = useState<ConsoleVariantsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState<number>(1); // Estado para totalPages

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // Marca selecionada
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]); // Geração selecionada

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
    // Atualiza a URL com os filtros de marca e geração
    window.history.pushState(
      {},
      "",
      `?brand=${brands.join(",")}&locale=${locale}&generation=${selectedGenerations.join(",")}&page=1&perPage=${perPage}`,
    );
  };

  const handleGenerationChange = (generations: string[]) => {
    setSelectedGenerations(generations);
    // Atualiza a URL com os filtros de marca e geração
    window.history.pushState(
      {},
      "",
      `?brand=${selectedBrands.join(",")}&locale=${locale}&generation=${generations.join(",")}&page=1&perPage=${perPage}`,
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedGenerations([]);
    window.history.pushState({}, "", `?locale=${locale}&page=1&perPage=${perPage}`);
  };

  // No componente frontend
  useEffect(() => {
    const fetchConsoleVariants = async () => {
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

      try {
        const data: ConsoleVariantsResponse = await apiFetch(`/consoles?${params.toString()}`);
        setConsoleVariants(data);
        setTotalPages(data.meta.totalPages);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An error occurred while fetching the console variants.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConsoleVariants();
  }, [selectedBrands, selectedGenerations, locale, page, perPage]);
  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="flex">
        <div className="w-1/4">
          <FilterContainer
            onBrandChange={handleBrandChange}
            onGenerationChange={handleGenerationChange}
            selectedBrands={selectedBrands} // Passando os filtros para o FilterContainer
            selectedGenerations={selectedGenerations} // Passando as gerações para o FilterContainer
          />
        </div>
        <div className="w-3/4 ">
          {consoleVariants && consoleVariants?.items.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                {consoleVariants?.items.map((variant) => (
                  <ConsoleCard
                    key={variant.id}
                    name={variant.name}
                    consoleName={variant.consoleName}
                    brand={variant.brand.slug}
                    imageUrl={variant.imageUrl || "https://via.placeholder.com/150"}
                    description="Description of the console"
                    slug={variant.slug}
                  />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  window.location.search = `?brand=${selectedBrands.join(",")}&locale=${locale}&generation=${selectedGenerations.join(",")}&page=${newPage}&perPage=${perPage}`;
                }}
              />
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
    </>
  );
};

export default CatalogComponent;
