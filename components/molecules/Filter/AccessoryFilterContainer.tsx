// components/molecules/Filter/AccessoryFilterContainer.tsx
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import AccessorySybTypeFilter from "./AccessorySybTypeFilter/AccessorySybTypeFilter";
import AccessoryTypeFilter from "./AccessoryTypeFilter/AccessoryTypeFilter";
import ConsoleFilter from "./ConsoleFilter/ConsoleFilter";
import clsx from "clsx";
import SingleCheckboxFilter from "./SingleCheckboxFilter/SingleCheckboxFilter";

interface AccessoryFilterContainerProps {
  selectedTypes: string[];
  selectedSubTypes: string[];
  selectedConsoles: string[];
  onConsoleChange: (consoles: string[]) => void;
  onTypeChange: (types: string[]) => void;
  onSubTypeChange: (subTypes: string[]) => void;
  clearFilters: () => void;
  className?: string;
  locale?: string;
  onFavoriteChange?: (showOnlyFavorites: boolean) => void;
  showOnlyFavorites?: boolean;
}

const AccessoryFilterContainer = ({
  selectedTypes,
  selectedSubTypes,
  selectedConsoles,
  onTypeChange,
  onSubTypeChange,
  onConsoleChange,
  clearFilters,
  className,
  locale = "pt",
  onFavoriteChange,
  showOnlyFavorites = false,
}: AccessoryFilterContainerProps) => {
  const t = useTranslations();

  return (
    <div className={clsx("space-y-6", className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{t("filters.label")}</h3>
        <Button variant="outline" size="sm" onClick={clearFilters} label={t("filters.clear")} />
      </div>

      <AccessoryTypeFilter
        selectedTypes={selectedTypes}
        onTypeChange={onTypeChange}
        locale={locale}
      />
      <AccessorySybTypeFilter
        selectedSubTypes={selectedSubTypes}
        onSubTypeChange={onSubTypeChange}
        selectedTypes={selectedTypes}
        locale={locale}
      />
      <ConsoleFilter
        selectedConsoles={selectedConsoles}
        onConsoleChange={onConsoleChange}
        locale={locale}
      />

      {onFavoriteChange && (
        <SingleCheckboxFilter
          label={t("filters.onlyFavorites")}
          checked={showOnlyFavorites}
          onChange={onFavoriteChange}
          description={t("filters.onlyFavoritesDescription")}
        />
      )}
    </div>
  );
};

export default AccessoryFilterContainer;
