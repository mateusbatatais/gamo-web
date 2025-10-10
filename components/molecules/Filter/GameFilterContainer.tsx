// components/molecules/Filter/GameFilterContainer.tsx
import { Button } from "@/components/atoms/Button/Button";
import clsx from "clsx";
import GenreFilter from "./GenreFilter/GenreFilter";
import PlatformFilter from "./PlatformFilter/PlatformFilter";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  return (
    <div className={clsx("space-y-6", className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{t("filters.label")}</h3>
        <Button variant="outline" size="sm" onClick={clearFilters} label={t("filters.clear")} />
      </div>

      <PlatformFilter selectedPlatforms={selectedPlatforms} onPlatformChange={onPlatformChange} />
      <GenreFilter selectedGenres={selectedGenres} onGenreChange={onGenreChange} />
    </div>
  );
};

export default GameFilterContainer;
