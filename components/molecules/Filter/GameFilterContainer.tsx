// components/molecules/Filter/GameFilterContainer.tsx
import { Button } from "@/components/atoms/Button/Button";
import clsx from "clsx";
import GenreFilter from "./GenreFilter/GenreFilter";
import PlatformFilter from "./PlatformFilter/PlatformFilter";
import { useTranslations } from "next-intl";
import SingleCheckboxFilter from "./SingleCheckboxFilter/SingleCheckboxFilter";
import MediaFilter from "./MediaFilter/MediaFilter";

interface GameFilterContainerProps {
  onGenreChange: (selectedGenres: number[]) => void;
  onPlatformChange: (selectedPlatforms: number[]) => void;
  selectedGenres: number[];
  selectedPlatforms: number[];
  selectedMedia?: string[];
  onMediaChange?: (selectedMedia: string[]) => void;
  clearFilters: () => void;
  className?: string;
  // Tornar as props de favoritos opcionais
  onFavoriteChange?: (showOnlyFavorites: boolean) => void;
  showOnlyFavorites?: boolean;
}

const GameFilterContainer = ({
  onGenreChange,
  onPlatformChange,
  onFavoriteChange,
  selectedGenres,
  selectedPlatforms,
  selectedMedia = [],
  onMediaChange,
  showOnlyFavorites = false,
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
      {onMediaChange && <MediaFilter selectedMedia={selectedMedia} onMediaChange={onMediaChange} />}
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

export default GameFilterContainer;
