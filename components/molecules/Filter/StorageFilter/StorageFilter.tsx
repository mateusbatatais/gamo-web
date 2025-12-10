"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";

interface StorageFilterProps {
  selectedStorageRanges: string[];
  onStorageChange: (selectedRanges: string[]) => void;
}

const StorageFilter = ({ selectedStorageRanges, onStorageChange }: StorageFilterProps) => {
  const t = useTranslations();

  const storageRanges = [
    { id: "0-1", label: t("filters.storage.upto1gb") },
    { id: "2-64", label: t("filters.storage.2to64gb") },
    { id: "65-512", label: t("filters.storage.65to512gb") },
    { id: "513-", label: t("filters.storage.above513gb") },
  ];

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedRanges = checked
      ? [...selectedStorageRanges, value]
      : selectedStorageRanges.filter((range) => range !== value);

    onStorageChange(newSelectedRanges);
  };

  return (
    <div className="mb-4">
      <p className="font-medium text-lg" data-testid="label-filter-storage">
        {t("filters.storage.label")}
      </p>
      {storageRanges.map((range) => (
        <div key={range.id} className="flex items-center">
          <Checkbox
            data-testid={`checkbox-${range.id}`}
            name="storage"
            value={range.id}
            checked={selectedStorageRanges.includes(range.id)}
            onChange={handleCheckboxChange}
            label={range.label}
          />
        </div>
      ))}
    </div>
  );
};

export default StorageFilter;
