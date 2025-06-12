"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api"; // Importando a função apiFetch
import { ConsoleVariantsResponse } from "@/@types/console";
import FilterContainer from "@/components/molecules/Filter/Filter"; // Agora usamos o FilterContainer
import ConsoleCard from "@/components/molecules/ConsoleCard/ConsoleCard";
import Pagination from "@/components/molecules/Pagination/Pagination";

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

  // Função para atualizar as marcas filtradas
  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
    // Atualiza a URL
    window.history.pushState(
      {},
      "",
      `?brand=${brands.join(",")}&locale=${locale}&page=1&perPage=${perPage}`,
    );
  };

  // Função para atualizar as gerações filtradas
  const handleGenerationChange = (generations: string[]) => {
    setSelectedGenerations(generations);
  };

  useEffect(() => {
    const fetchConsoleVariants = async () => {
      setLoading(true);
      setError("");

      try {
        const data: ConsoleVariantsResponse = await apiFetch(
          `/consoles?brand=${selectedBrands.join(",")}&locale=${locale}&generation=${selectedGenerations.join(",")}&page=${page}&perPage=${perPage}`,
        );
        setConsoleVariants(data);

        setTotalPages(data.meta.totalPages || 1); // Garantir que totalPages seja atribuído corretamente
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
  }, [selectedBrands, selectedGenerations, locale, page, perPage]); // Atualiza quando algum filtro mudar

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
          <div className="grid grid-cols-3 gap-4">
            {consoleVariants?.items.map((variant) => (
              <ConsoleCard
                key={variant.id}
                name={variant.name}
                consoleName={variant.consoleName}
                brand={variant.brand.slug}
                imageUrl={variant.imageUrl || "https://via.placeholder.com/150"}
                description="Description of the console"
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              window.location.search = `?brand=${selectedBrands.join(",")}&locale=${locale}&page=${newPage}&perPage=${perPage}`;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CatalogComponent;
