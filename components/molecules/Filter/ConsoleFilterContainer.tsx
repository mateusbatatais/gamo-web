// components/molecules/Filter/ConsoleFilterContainer.tsx
import { Button } from "@/components/atoms/Button/Button";
import BrandFilter from "./BrandFilter/BrandFilter";
import GenerationFilter from "./GenerationFilter/GenerationFilter";
import SingleCheckboxFilter from "./SingleCheckboxFilter/SingleCheckboxFilter";
import TypeFilter from "./TypeFilter/TypeFilter";
import clsx from "clsx";
import ModelFilter from "./ModelFilter/ModelFilter";
import MediaFormatFilter from "./MediaFormatFilter/MediaFormatFilter";
import StorageFilter from "./StorageFilter/StorageFilter";
import { useTranslations } from "next-intl";

interface ConsoleFilterContainerProps {
  onBrandChange: (selectedBrands: string[]) => void;
  onGenerationChange: (selectedGenerations: string[]) => void;
  onAllDigitalChange: (selectedAllDigital: boolean) => void;
  onModelChange: (selectedModels: string[]) => void;
  onTypeChange: (selectedTypes: string[]) => void;
  onMediaFormatChange: (selectedMediaFormats: string[]) => void;
  onRetroCompatibleChange: (retroCompatible: boolean) => void;
  onStorageChange: (selectedRanges: string[]) => void;
  selectedStorageRanges: string[];

  selectedBrands: string[];
  selectedGenerations: string[];
  selectedAllDigital: boolean;
  selectedTypes: string[];
  selectedModels: string[];
  selectedMediaFormats: string[];
  retroCompatible: boolean;
  clearFilters: () => void;
  className?: string;
  onFavoriteChange?: (showOnlyFavorites: boolean) => void;
  showOnlyFavorites?: boolean;
}

const ConsoleFilterContainer = ({
  onBrandChange,
  onGenerationChange,
  onAllDigitalChange,
  onModelChange,
  onTypeChange,
  onMediaFormatChange,
  onRetroCompatibleChange,
  onStorageChange,
  selectedStorageRanges,
  selectedBrands,
  selectedGenerations,
  selectedAllDigital,
  selectedTypes,
  selectedModels,
  selectedMediaFormats,
  retroCompatible,
  clearFilters,
  className,
  onFavoriteChange,
  showOnlyFavorites = false,
}: ConsoleFilterContainerProps) => {
  const t = useTranslations();

  return (
    <div className={clsx("space-y-6", className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{t("filters.label")}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          label={t("filters.clear")}
          data-testid="clear-filters-button"
        />
      </div>

      <BrandFilter selectedBrands={selectedBrands} onBrandChange={onBrandChange} />
      <GenerationFilter
        selectedGenerations={selectedGenerations}
        onGenerationChange={onGenerationChange}
      />
      <ModelFilter selectedModels={selectedModels} onModelChange={onModelChange} />
      <TypeFilter selectedTypes={selectedTypes} onTypeChange={onTypeChange} />

      <StorageFilter
        selectedStorageRanges={selectedStorageRanges}
        onStorageChange={onStorageChange}
      />

      <MediaFormatFilter
        selectedMediaFormats={selectedMediaFormats}
        onMediaFormatChange={onMediaFormatChange}
      />

      <SingleCheckboxFilter
        label={t("filters.retroCompatible")}
        checked={retroCompatible}
        onChange={onRetroCompatibleChange}
        description={t("filters.retroCompatible")}
      />
      <SingleCheckboxFilter
        label={t("filters.allDigital")}
        checked={selectedAllDigital}
        onChange={onAllDigitalChange}
        description={t("filters.allDigitalDescription")}
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

export default ConsoleFilterContainer;
