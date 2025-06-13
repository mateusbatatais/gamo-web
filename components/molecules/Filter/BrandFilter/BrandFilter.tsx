import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import { useTranslations } from "next-intl";

interface BrandFilterProps {
  selectedBrands: string[];
  onBrandChange: (selectedBrands: string[]) => void;
}

const BrandFilter = ({ selectedBrands, onBrandChange }: BrandFilterProps) => {
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations();

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<{ slug: string; id: number }[]>("/brands");
        const formattedBrands = data.map((brand) => ({
          value: brand.slug,
          label: brand.slug ? brand.slug.charAt(0).toUpperCase() + brand.slug.slice(1) : "",
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

  if (loading) return <div>{t("common.loading")}</div>;
  if (error) return <div>{error}</div>;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedBrands = checked
      ? [...selectedBrands, value]
      : selectedBrands.filter((brand) => brand !== value);

    onBrandChange(newSelectedBrands);
  };

  return (
    <div className="mb-4">
      <p className="font-medium text-lg" data-testid="label-filter">
        {t("filters.brand.label")}
      </p>
      {brands.map((brand) => (
        <div key={brand.value} className="flex items-center">
          <input
            type="checkbox"
            value={brand.value}
            checked={selectedBrands.includes(brand.value)}
            onChange={handleCheckboxChange}
            id={brand.value}
            className="mr-2"
          />
          <label htmlFor={brand.value}>{brand.label}</label>
        </div>
      ))}
    </div>
  );
};

export default BrandFilter;
