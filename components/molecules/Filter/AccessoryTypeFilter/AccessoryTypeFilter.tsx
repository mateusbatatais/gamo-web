// components/molecules/Filter/AccessoryTypeFilter.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import useAccessoryTypes from "@/hooks/filters/useAccessoryTypes";

interface AccessoryTypeFilterProps {
  selectedTypes: string[];
  onTypeChange: (selectedTypes: string[]) => void;
  locale?: string;
}

const AccessoryTypeFilter = ({
  selectedTypes,
  onTypeChange,
  locale = "pt",
}: AccessoryTypeFilterProps) => {
  const { data: types, isLoading, error } = useAccessoryTypes(locale);
  const [showAll, setShowAll] = useState(false);
  const t = useTranslations();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedTypes = checked
      ? [...selectedTypes, value]
      : selectedTypes.filter((type) => type !== value);

    onTypeChange(newSelectedTypes);
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
  if (!types) return null;

  // Separar os primeiros 4 tipos e o restante
  const firstFourTypes = types.slice(0, 4);
  const remainingTypes = types.slice(4);

  return (
    <div className="mb-4">
      <p className="font-medium text-lg mb-2" data-testid="label-filter">
        {t("filters.type.label")}
      </p>

      {/* Primeiros 4 tipos (sempre visíveis) */}
      <div className="space-y-1">
        {firstFourTypes.map((type) => (
          <div key={type.slug} className="flex items-center">
            <Checkbox
              data-testid={`checkbox-${type.slug}`}
              name="type"
              value={type.slug}
              checked={selectedTypes.includes(type.slug)}
              onChange={handleCheckboxChange}
              label={type.name}
            />
          </div>
        ))}
      </div>

      {/* Tipos restantes (colapsáveis) */}
      {remainingTypes.length > 0 && (
        <div className="mt-2">
          {showAll ? (
            <div className="space-y-1">
              {remainingTypes.map((type) => (
                <div key={type.slug} className="flex items-center">
                  <Checkbox
                    data-testid={`checkbox-${type.slug}`}
                    name="type"
                    value={type.slug}
                    checked={selectedTypes.includes(type.slug)}
                    onChange={handleCheckboxChange}
                    label={type.name}
                  />
                </div>
              ))}
            </div>
          ) : null}

          <button
            onClick={toggleShowAll}
            className="flex items-center mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <span>{showAll ? t("filters.showLess") : t("filters.showMore")}</span>
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

export default AccessoryTypeFilter;
