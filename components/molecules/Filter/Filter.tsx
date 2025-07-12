// components/molecules/Filter/FilterContainer.tsx
import { Button } from "@/components/atoms/Button/Button";
import BrandFilter from "./BrandFilter/BrandFilter";
import GenerationFilter from "./GenerationFilter/GenerationFilter";
import clsx from "clsx";

interface FilterContainerProps {
  onBrandChange: (selectedBrands: string[]) => void;
  onGenerationChange: (selectedGenerations: string[]) => void;
  selectedBrands: string[];
  selectedGenerations: string[];
  clearFilters: () => void;
  className?: string;
}

const FilterContainer = ({
  onBrandChange,
  onGenerationChange,
  selectedBrands,
  selectedGenerations,
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

      <small>Incluir filtros por modelo e se é portable</small>

      <Button onClick={clearFilters} variant="outline" className="w-full" label="Limpar filtros" />
    </div>
  );
};

export default FilterContainer;
