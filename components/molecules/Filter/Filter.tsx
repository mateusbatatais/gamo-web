import BrandFilter from "./BrandFilter/BrandFilter";
import GenerationFilter from "./GenerationFilter/GenerationFilter";

interface FilterContainerProps {
  onBrandChange: (selectedBrands: string[]) => void;
  onGenerationChange: (selectedGenerations: string[]) => void;
  selectedBrands: string[]; // Adicionando a propriedade selectedBrands
  selectedGenerations: string[]; // Adicionando a propriedade selectedGenerations
}

const FilterContainer = ({
  onBrandChange,
  onGenerationChange,
  selectedBrands, // Agora vamos usar as props passadas
  selectedGenerations, // Agora vamos usar as props passadas
}: FilterContainerProps) => {
  return (
    <div className="space-y-4">
      <BrandFilter selectedBrands={selectedBrands} onBrandChange={onBrandChange} />
      <GenerationFilter
        selectedGenerations={selectedGenerations}
        onGenerationChange={onGenerationChange}
      />
    </div>
  );
};

export default FilterContainer;
