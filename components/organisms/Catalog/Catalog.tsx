// components/organisms/CatalogComponent.tsx
"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api"; // Importando a função apiFetch
import { ConsoleVariantsResponse } from "@/@types/console";
import Filter from "@/components/molecules/Filter/Filter";
import ConsoleCard from "@/components/molecules/ConsoleCard/ConsoleCard";
import Pagination from "@/components/molecules/Pagination/Pagination";

interface CatalogComponentProps {
  brand: string;
  locale: string;
  page: number;
  perPage: number;
  totalPages: number;
}

const CatalogComponent = ({ brand, locale, page, perPage, totalPages }: CatalogComponentProps) => {
  const [consoleVariants, setConsoleVariants] = useState<ConsoleVariantsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConsoleVariants = async () => {
      setLoading(true);
      setError("");

      try {
        const data: ConsoleVariantsResponse = await apiFetch(
          `/consoles?brand=${brand}&locale=${locale}&page=${page}&perPage=${perPage}`,
        );
        setConsoleVariants(data);
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
  }, [brand, locale, page, perPage]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div>
      <Filter
        selectedBrand={brand}
        onBrandChange={(selectedBrand) => {
          window.location.search = `?brand=${selectedBrand}&locale=${locale}&page=1&perPage=${perPage}`;
        }}
      />

      <div className="grid grid-cols-3 gap-4">
        {consoleVariants?.items.map((variant) => (
          <ConsoleCard
            key={variant.id}
            name={variant.name}
            consoleName={variant.consoleName}
            brand={variant.brand.slug}
            imageUrl="https://via.placeholder.com/150"
            description="Description of the console"
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          window.location.search = `?brand=${brand}&locale=${locale}&page=${newPage}&perPage=${perPage}`;
        }}
      />
    </div>
  );
};

export default CatalogComponent;
