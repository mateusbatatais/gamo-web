// components/molecules/Filter/MarketplaceFilterContainer.tsx
import { Button } from "@/components/atoms/Button/Button";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface MarketplaceFilterContainerProps {
  onItemTypeChange: (selectedTypes: string[]) => void;
  onConditionChange: (selectedConditions: string[]) => void;
  selectedItemTypes: string[];
  selectedConditions: string[];
  clearFilters: () => void;
  className?: string;
}

const ITEM_TYPES = [
  { value: "GAME", label: "Jogos" },
  { value: "CONSOLE", label: "Consoles" },
  { value: "ACCESSORY", label: "Acessórios" },
];

const CONDITION_OPTIONS = [
  { value: "NEW", label: "Novo" },
  { value: "USED", label: "Usado" },
  { value: "REFURBISHED", label: "Recondicionado" },
];

const MarketplaceFilterContainer = ({
  onItemTypeChange,
  onConditionChange,
  selectedItemTypes,
  selectedConditions,
  clearFilters,
  className,
}: MarketplaceFilterContainerProps) => {
  const t = useTranslations();

  const handleItemTypeCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedTypes = checked
      ? [...selectedItemTypes, value]
      : selectedItemTypes.filter((type) => type !== value);
    onItemTypeChange(newSelectedTypes);
  };

  const handleConditionCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedConditions = checked
      ? [...selectedConditions, value]
      : selectedConditions.filter((condition) => condition !== value);
    onConditionChange(newSelectedConditions);
  };

  return (
    <div className={clsx("space-y-6", className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{t("filters.label")}</h3>
        <Button variant="outline" size="sm" onClick={clearFilters} label={t("filters.clear")} />
      </div>

      {/* Tipo de Item */}
      <div className="mb-4">
        <p className="font-medium text-lg mb-2">Tipo de Item</p>
        {ITEM_TYPES.map((type) => (
          <div key={type.value} className="flex items-center">
            <Checkbox
              name="itemType"
              value={type.value}
              checked={selectedItemTypes.includes(type.value)}
              onChange={handleItemTypeCheckboxChange}
              label={type.label}
            />
          </div>
        ))}
      </div>

      {/* Condição */}
      <div className="mb-4">
        <p className="font-medium text-lg mb-2">Condição</p>
        {CONDITION_OPTIONS.map((condition) => (
          <div key={condition.value} className="flex items-center">
            <Checkbox
              name="condition"
              value={condition.value}
              checked={selectedConditions.includes(condition.value)}
              onChange={handleConditionCheckboxChange}
              label={condition.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceFilterContainer;
