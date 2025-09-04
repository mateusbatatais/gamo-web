// components/molecules/Filter/AccessoryTypeFilter.tsx
"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
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
  const t = useTranslations();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedTypes = checked
      ? [...selectedTypes, value]
      : selectedTypes.filter((type) => type !== value);

    onTypeChange(newSelectedTypes);
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

  return (
    <div className="mb-4">
      <p className="font-medium text-lg">{t("filters.type.label")}</p>
      {types.map((type) => (
        <div key={type.slug} className="flex items-center">
          <Checkbox
            name="type"
            value={type.slug}
            checked={selectedTypes.includes(type.slug)}
            onChange={handleCheckboxChange}
            label={type.name}
          />
        </div>
      ))}
    </div>
  );
};

export default AccessoryTypeFilter;
