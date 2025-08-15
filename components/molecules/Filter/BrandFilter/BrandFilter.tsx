"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import useBrands from "@/hooks/filters/useBrands";

interface BrandFilterProps {
  selectedBrands: string[];
  onBrandChange: (selectedBrands: string[]) => void;
}

const BrandFilter = ({ selectedBrands, onBrandChange }: BrandFilterProps) => {
  const { data: brands, isLoading, error } = useBrands();
  const t = useTranslations();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedBrands = checked
      ? [...selectedBrands, value]
      : selectedBrands.filter((brand) => brand !== value);

    onBrandChange(newSelectedBrands);
  };

  if (isLoading)
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

  if (error) return <div>{error.message}</div>;
  if (!brands) return null;

  return (
    <div className="mb-4">
      <p className="font-medium text-lg" data-testid="label-filter">
        {t("filters.brand.label")}
      </p>
      {brands.map((brand) => (
        <div key={brand.slug} className="flex items-center">
          <Checkbox
            data-testid={`checkbox-${brand.slug}`}
            name="brand"
            value={brand.slug}
            checked={selectedBrands.includes(brand.slug)}
            onChange={handleCheckboxChange}
            label={brand.slug.charAt(0).toUpperCase() + brand.slug.slice(1)}
          />
        </div>
      ))}
    </div>
  );
};

export default BrandFilter;
