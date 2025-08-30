// components/molecules/Filter/FilterContainer.tsx
import { Button } from "@/components/atoms/Button/Button";
import BrandFilter from "./BrandFilter/BrandFilter";
import GenerationFilter from "./GenerationFilter/GenerationFilter";
import SingleCheckboxFilter from "./SingleCheckboxFilter/SingleCheckboxFilter";
import TypeFilter from "./TypeFilter/TypeFilter";
import clsx from "clsx";
import ModelFilter from "./ModelFilter/ModelFilter";
import MediaFormatFilter from "./MediaFormatFilter/MediaFormatFilter";
import StorageFilter from "./StorageFilter/StorageFilter";

interface FilterContainerProps {
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
}

const FilterContainer = ({
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
}: FilterContainerProps) => {
  return (
    <div className={clsx("space-y-6", className)}>
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
        label="Retrocompatível"
        checked={retroCompatible}
        onChange={onRetroCompatibleChange}
      />
      <SingleCheckboxFilter
        label="All Digital"
        checked={selectedAllDigital}
        onChange={onAllDigitalChange}
        description="Mostrar apenas consoles digitais"
      />
      <Button onClick={clearFilters} variant="outline" className="w-full" label="Limpar filtros" />
    </div>
  );
};

export default FilterContainer;
