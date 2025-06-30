import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

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

  if (loading)
    return (
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
    );
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
          <Checkbox
            data-testid={`checkbox-${brand.value}`}
            name="brand"
            value={brand.value}
            checked={selectedBrands.includes(brand.value)}
            onChange={handleCheckboxChange}
            label={brand.label}
          />
        </div>
      ))}
    </div>
  );
};

export default BrandFilter;
