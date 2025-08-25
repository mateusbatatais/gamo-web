// components/molecules/Filter/FilterContainer.tsx
import { Button } from "@/components/atoms/Button/Button";
import BrandFilter from "./BrandFilter/BrandFilter";
import GenerationFilter from "./GenerationFilter/GenerationFilter";
import SingleCheckboxFilter from "./SingleCheckboxFilter/SingleCheckboxFilter";
import TypeFilter from "./TypeFilter/TypeFilter";
import clsx from "clsx";
import ModelFilter from "./ModelFilter/ModelFilter";

interface FilterContainerProps {
  onBrandChange: (selectedBrands: string[]) => void;
  onGenerationChange: (selectedGenerations: string[]) => void;
  onAllDigitalChange: (selectedAllDigital: boolean) => void;
  onModelChange: (selectedModels: string[]) => void;
  onTypeChange: (selectedTypes: string[]) => void;
  selectedBrands: string[];
  selectedGenerations: string[];
  selectedAllDigital: boolean;
  selectedTypes: string[];
  selectedModels: string[];

  clearFilters: () => void;
  className?: string;
}

const FilterContainer = ({
  onBrandChange,
  onGenerationChange,
  onAllDigitalChange,
  onModelChange,
  onTypeChange,
  selectedBrands,
  selectedGenerations,
  selectedAllDigital,
  selectedTypes,
  selectedModels,
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
