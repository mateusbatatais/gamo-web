// components/molecules/Filter/AccessoryFilterContainer.tsx
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import AccessorySybTypeFilter from "./AccessorySybTypeFilter/AccessorySybTypeFilter";
import AccessoryTypeFilter from "./AccessoryTypeFilter/AccessoryTypeFilter";

interface AccessoryFilterContainerProps {
  selectedTypes: string[];
  selectedSubTypes: string[];
  onTypeChange: (types: string[]) => void;
  onSubTypeChange: (subTypes: string[]) => void;
  clearFilters: () => void;
  locale?: string;
}

const AccessoryFilterContainer = ({
  selectedTypes,
  selectedSubTypes,
  onTypeChange,
  onSubTypeChange,
  clearFilters,
  locale = "pt",
}: AccessoryFilterContainerProps) => {
  const t = useTranslations();

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{t("filters.label")}</h3>
        <Button variant="outline" size="sm" onClick={clearFilters} label={t("filters.clearAll")} />
      </div>
      <AccessoryTypeFilter
        selectedTypes={selectedTypes}
        onTypeChange={onTypeChange}
        locale={locale}
      />
      <AccessorySybTypeFilter
        selectedSubTypes={selectedSubTypes}
        onSubTypeChange={onSubTypeChange}
        selectedType={selectedTypes[0]} // Assume single type selection for simplicity
        locale={locale}
      />
      <p>aqui precisa de filtros de plataforma</p>
    </div>
  );
};

export default AccessoryFilterContainer;
