// components/molecules/Filter/MarketplaceFilterContainer.tsx
import { Button } from "@/components/atoms/Button/Button";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Input } from "@/components/atoms/Input/Input";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import GameFilterContainer from "./GameFilterContainer";
import ConsoleFilterContainer from "./ConsoleFilterContainer";
import AccessoryFilterContainer from "./AccessoryFilterContainer";

interface MarketplaceFilterContainerProps {
  onItemTypeChange: (selectedTypes: string[]) => void;
  onConditionChange: (selectedConditions: string[]) => void;
  selectedItemTypes: string[];
  selectedConditions: string[];
  clearFilters: () => void;
  className?: string;
  // General filter props
  priceMin?: string;
  priceMax?: string;
  hasBox?: boolean;
  hasManual?: boolean;
  acceptsTrade?: boolean;
  onPriceMinChange?: (value: string) => void;
  onPriceMaxChange?: (value: string) => void;
  onHasBoxChange?: (value: boolean) => void;
  onHasManualChange?: (value: boolean) => void;
  onAcceptsTradeChange?: (value: boolean) => void;
  // Game filter props
  selectedGenres?: number[];
  selectedPlatforms?: number[];
  selectedMedia?: string[];
  onGenreChange?: (genres: number[]) => void;
  onPlatformChange?: (platforms: number[]) => void;
  onMediaChange?: (media: string[]) => void;
  // Console filter props
  selectedBrands?: string[];
  selectedGenerations?: string[];
  selectedModels?: string[];
  selectedConsoleTypes?: string[];
  selectedMediaFormats?: string[];
  selectedStorageRanges?: string[];
  allDigital?: boolean;
  retroCompatible?: boolean;
  onBrandChange?: (brands: string[]) => void;
  onGenerationChange?: (generations: string[]) => void;
  onModelChange?: (models: string[]) => void;
  onConsoleTypeChange?: (types: string[]) => void;
  onMediaFormatChange?: (formats: string[]) => void;
  onStorageChange?: (ranges: string[]) => void;
  onAllDigitalChange?: (value: boolean) => void;
  onRetroCompatibleChange?: (value: boolean) => void;
  // Accessory filter props
  selectedAccessoryTypes?: string[];
  selectedAccessorySubTypes?: string[];
  selectedConsoles?: string[];
  onAccessoryTypeChange?: (types: string[]) => void;
  onAccessorySubTypeChange?: (subTypes: string[]) => void;
  onConsoleChange?: (consoles: string[]) => void;
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
  // General props
  priceMin = "",
  priceMax = "",
  hasBox = false,
  hasManual = false,
  acceptsTrade = false,
  onPriceMinChange,
  onPriceMaxChange,
  onHasBoxChange,
  onHasManualChange,
  onAcceptsTradeChange,
  // Game props
  selectedGenres = [],
  selectedPlatforms = [],
  selectedMedia = [],
  onGenreChange,
  onPlatformChange,
  onMediaChange,
  // Console props
  selectedBrands = [],
  selectedGenerations = [],
  selectedModels = [],
  selectedConsoleTypes = [],
  selectedMediaFormats = [],
  selectedStorageRanges = [],
  allDigital = false,
  retroCompatible = false,
  onBrandChange,
  onGenerationChange,
  onModelChange,
  onConsoleTypeChange,
  onMediaFormatChange,
  onStorageChange,
  onAllDigitalChange,
  onRetroCompatibleChange,
  // Accessory props
  selectedAccessoryTypes = [],
  selectedAccessorySubTypes = [],
  selectedConsoles = [],
  onAccessoryTypeChange,
  onAccessorySubTypeChange,
  onConsoleChange,
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

  const renderGeneralFilters = () => (
    <>
      {/* Price Range */}
      <div className="mb-4">
        <p className="font-medium text-lg mb-2">Preço</p>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Mín"
            value={priceMin}
            onChange={(e) => onPriceMinChange?.(e.target.value)}
            className="w-full"
            inputSize="sm"
          />
          <span className="text-gray-500">-</span>
          <Input
            type="number"
            placeholder="Máx"
            value={priceMax}
            onChange={(e) => onPriceMaxChange?.(e.target.value)}
            className="w-full"
            inputSize="sm"
          />
        </div>
      </div>

      {/* Other Options */}
      <div className="mb-4">
        <p className="font-medium text-lg mb-2">Outros</p>
        <div className="space-y-2">
          <Checkbox
            name="hasBox"
            checked={hasBox}
            onChange={(e) => onHasBoxChange?.(e.target.checked)}
            label="Com Caixa"
          />
          <Checkbox
            name="hasManual"
            checked={hasManual}
            onChange={(e) => onHasManualChange?.(e.target.checked)}
            label="Com Manual"
          />
          <Checkbox
            name="acceptsTrade"
            checked={acceptsTrade}
            onChange={(e) => onAcceptsTradeChange?.(e.target.checked)}
            label="Aceita Trocas"
          />
        </div>
      </div>
    </>
  );

  // Determine which filter container to show
  const singleType = selectedItemTypes.length === 1 ? selectedItemTypes[0] : null;
  const showGameFilters = singleType === "GAME";
  const showConsoleFilters = singleType === "CONSOLE";
  const showAccessoryFilters = singleType === "ACCESSORY";

  // Render type-specific filters
  if (showGameFilters && onGenreChange && onPlatformChange) {
    return (
      <div className={clsx("space-y-6", className)}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{t("filters.label")}</h3>
          <Button variant="outline" size="sm" onClick={clearFilters} label={t("filters.clear")} />
        </div>

        {/* Item Type (read-only when showing specific filters) */}
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

        {/* Condition */}
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

        {renderGeneralFilters()}

        {/* Game-specific filters */}
        <GameFilterContainer
          selectedGenres={selectedGenres}
          selectedPlatforms={selectedPlatforms}
          selectedMedia={selectedMedia}
          onGenreChange={onGenreChange}
          onPlatformChange={onPlatformChange}
          onMediaChange={onMediaChange}
          clearFilters={() => {}} // Handled by parent
          className="mt-0! space-y-4!"
        />
      </div>
    );
  }

  if (
    showConsoleFilters &&
    onBrandChange &&
    onGenerationChange &&
    onModelChange &&
    onConsoleTypeChange &&
    onMediaFormatChange &&
    onStorageChange &&
    onAllDigitalChange &&
    onRetroCompatibleChange
  ) {
    return (
      <div className={clsx("space-y-6", className)}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{t("filters.label")}</h3>
          <Button variant="outline" size="sm" onClick={clearFilters} label={t("filters.clear")} />
        </div>

        {/* Item Type */}
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

        {/* Condition */}
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

        {renderGeneralFilters()}

        {/* Console-specific filters */}
        <ConsoleFilterContainer
          selectedBrands={selectedBrands}
          selectedGenerations={selectedGenerations}
          selectedModels={selectedModels}
          selectedTypes={selectedConsoleTypes}
          selectedMediaFormats={selectedMediaFormats}
          selectedStorageRanges={selectedStorageRanges}
          selectedAllDigital={allDigital}
          retroCompatible={retroCompatible}
          onBrandChange={onBrandChange}
          onGenerationChange={onGenerationChange}
          onModelChange={onModelChange}
          onTypeChange={onConsoleTypeChange}
          onMediaFormatChange={onMediaFormatChange}
          onStorageChange={onStorageChange}
          onAllDigitalChange={onAllDigitalChange}
          onRetroCompatibleChange={onRetroCompatibleChange}
          clearFilters={() => {}} // Handled by parent
          className="mt-0! space-y-4!"
        />
      </div>
    );
  }

  if (
    showAccessoryFilters &&
    onAccessoryTypeChange &&
    onAccessorySubTypeChange &&
    onConsoleChange
  ) {
    return (
      <div className={clsx("space-y-6", className)}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{t("filters.label")}</h3>
          <Button variant="outline" size="sm" onClick={clearFilters} label={t("filters.clear")} />
        </div>

        {/* Item Type */}
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

        {/* Condition */}
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

        {/* Accessory-specific filters */}
        <AccessoryFilterContainer
          selectedTypes={selectedAccessoryTypes}
          selectedSubTypes={selectedAccessorySubTypes}
          selectedConsoles={selectedConsoles}
          onTypeChange={onAccessoryTypeChange}
          onSubTypeChange={onAccessorySubTypeChange}
          onConsoleChange={onConsoleChange}
          clearFilters={() => {}} // Handled by parent
          className="mt-0! space-y-4!"
        />
      </div>
    );
  }

  // Default: show generic filters
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
