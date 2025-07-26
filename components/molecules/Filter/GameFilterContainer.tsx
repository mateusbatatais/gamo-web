// components/molecules/Filter/GameFilterContainer.tsx
import { Button } from "@/components/atoms/Button/Button";
import clsx from "clsx";
import GenreFilter from "./GenreFilter/GenreFilter";
import PlatformFilter from "./PlatformFilter/PlatformFilter";

interface GameFilterContainerProps {
  onGenreChange: (selectedGenres: number[]) => void;
  onPlatformChange: (selectedPlatforms: number[]) => void;
  selectedGenres: number[];
  selectedPlatforms: number[];
  clearFilters: () => void;
  className?: string;
}

const GameFilterContainer = ({
  onGenreChange,
  onPlatformChange,
  selectedGenres,
  selectedPlatforms,
  clearFilters,
  className,
}: GameFilterContainerProps) => {
  return (
    <div className={clsx("space-y-6", className)}>
      <GenreFilter selectedGenres={selectedGenres} onGenreChange={onGenreChange} />
      <PlatformFilter selectedPlatforms={selectedPlatforms} onPlatformChange={onPlatformChange} />
      <Button onClick={clearFilters} variant="outline" className="w-full" label="Limpar filtros" />
    </div>
  );
};

export default GameFilterContainer;
