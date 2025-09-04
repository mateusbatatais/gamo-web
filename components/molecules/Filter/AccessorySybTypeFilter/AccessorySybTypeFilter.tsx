// components/molecules/Filter/AccessorySybTypeFilter.tsx
"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import useAccessorySubTypes from "@/hooks/filters/useAccessorySubTypes";

interface AccessorySybTypeFilterProps {
  selectedSubTypes: string[];
  onSubTypeChange: (selectedSubTypes: string[]) => void;
  selectedType?: string;
  locale?: string;
}

const AccessorySybTypeFilter = ({
  selectedSubTypes,
  onSubTypeChange,
  selectedType,
  locale = "pt",
}: AccessorySybTypeFilterProps) => {
  const { data: subTypes, isLoading, error } = useAccessorySubTypes(selectedType, locale);
  const t = useTranslations();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedSubTypes = checked
      ? [...selectedSubTypes, value]
      : selectedSubTypes.filter((subType) => subType !== value);

    onSubTypeChange(newSelectedSubTypes);
  };

  if (!selectedType) {
    return (
      <div className="mb-4">
        <p className="font-medium text-lg">{t("filters.subType.label")}</p>
        <p className="text-sm text-gray-500">{t("filters.subType.selectTypeFirst")}</p>
      </div>
    );
  }

  if (isLoading)
    return (
      <div>
        <Skeleton className="h-6 w-1/2 mb-3" animated />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
              <Skeleton className="h-4 w-3/4" animated />
            </div>
          ))}
        </div>
      </div>
    );

  if (error) return <div>{error.message}</div>;

  return (
    <div className="mb-4">
      <p className="font-medium text-lg">{t("filters.subType.label")}</p>
      {subTypes && subTypes.length > 0 ? (
        subTypes.map((subType) => (
          <div key={subType.slug} className="flex items-center">
            <Checkbox
              name="subType"
              value={subType.slug}
              checked={selectedSubTypes.includes(subType.slug)}
              onChange={handleCheckboxChange}
              label={subType.name}
            />
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">{t("filters.subType.noSubTypes")}</p>
      )}
    </div>
  );
};

export default AccessorySybTypeFilter;
