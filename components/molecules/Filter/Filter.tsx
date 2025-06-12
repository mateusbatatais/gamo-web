// components/molecules/Filter.tsx
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { Select, SelectOption } from "@/components/atoms/Select/Select";

interface FilterProps {
  selectedBrand: string;
  onBrandChange: (selectedBrand: string) => void;
}

const Filter = ({ selectedBrand, onBrandChange }: FilterProps) => {
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await apiFetch<{ slug: string; id: number }[]>("/brands");
        const formattedBrands = data.map((brand) => ({
          value: brand.slug,
          label: brand.slug.charAt(0).toUpperCase() + brand.slug.slice(1), // Capitalizando o nome da marca
        }));
        setBrands(formattedBrands);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An error occurred while fetching brands.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) return <div>Loading brands...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mb-4">
      <Select
        label="Filter by Brand"
        value={selectedBrand}
        onChange={(e) => onBrandChange(e.target.value)}
        options={brands}
      />
    </div>
  );
};

export default Filter;
