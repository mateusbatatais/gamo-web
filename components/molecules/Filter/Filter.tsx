import { Button } from "@/components/atoms/Button/Button";
import BrandFilter from "./BrandFilter/BrandFilter";
import GenerationFilter from "./GenerationFilter/GenerationFilter";

interface FilterContainerProps {
  onBrandChange: (selectedBrands: string[]) => void;
  onGenerationChange: (selectedGenerations: string[]) => void;
  selectedBrands: string[]; // Adicionando a propriedade selectedBrands
  selectedGenerations: string[]; // Adicionando a propriedade selectedGenerations
  clearFilters: () => void; // Adicionando a propriedade clearFilters
}

const FilterContainer = ({
  onBrandChange,
  onGenerationChange,
  selectedBrands, // Agora vamos usar as props passadas
  selectedGenerations, // Agora vamos usar as props passadas
  clearFilters,
}: FilterContainerProps) => {
  return (
    <>
      <div className="space-y-4">
        <BrandFilter selectedBrands={selectedBrands} onBrandChange={onBrandChange} />
        <GenerationFilter
          selectedGenerations={selectedGenerations}
          onGenerationChange={onGenerationChange}
        />
      </div>
      <Button
        onClick={clearFilters}
        variant="outline"
        className="w-full mt-4 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Limpar filtros
      </Button>
    </>
  );
};

export default FilterContainer;
