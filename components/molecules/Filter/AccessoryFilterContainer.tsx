// components/molecules/Filter/AccessoryFilterContainer.tsx
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import AccessorySybTypeFilter from "./AccessorySybTypeFilter/AccessorySybTypeFilter";
import AccessoryTypeFilter from "./AccessoryTypeFilter/AccessoryTypeFilter";
import ConsoleFilter from "./ConsoleFilter/ConsoleFilter";
import clsx from "clsx";

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
    </div>
  );
};

export default AccessoryFilterContainer;
