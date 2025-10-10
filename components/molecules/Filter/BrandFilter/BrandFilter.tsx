// components/molecules/Filter/BrandFilter.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import useBrands from "@/hooks/filters/useBrands";

interface BrandFilterProps {
  selectedBrands: string[];
  onBrandChange: (selectedBrands: string[]) => void;
}

const BrandFilter = ({ selectedBrands, onBrandChange }: BrandFilterProps) => {
  const { data: brands, isLoading, error } = useBrands();
  const [showAll, setShowAll] = useState(false);
  const t = useTranslations();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedBrands = checked
      ? [...selectedBrands, value]
      : selectedBrands.filter((brand) => brand !== value);

    onBrandChange(newSelectedBrands);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
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

  const firstFiveBrands = brands.slice(0, 5);
  const remainingBrands = brands.slice(5);

  return (
    <div className="mb-4">
      <p className="font-medium text-lg mb-2" data-testid="label-filter">
        {t("filters.brand.label")}
      </p>

      <div className="space-y-1">
        {firstFiveBrands.map((brand) => (
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

      {remainingBrands.length > 0 && (
        <div className="mt-2">
          {showAll ? (
            <div className="space-y-1">
              {remainingBrands.map((brand) => (
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
          ) : null}

          <button
            onClick={toggleShowAll}
            className="flex items-center mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <span>
              {showAll
                ? t("filters.showLess")
                : `${t("filters.showMore")} (${remainingBrands.length})`}
            </span>
            {showAll ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandFilter;
