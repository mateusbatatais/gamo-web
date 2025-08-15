"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import useGenres from "@/hooks/filters/useGenres";

interface GenreFilterProps {
  selectedGenres: number[];
  onGenreChange: (selectedGenres: number[]) => void;
}

const GenreFilter = ({ selectedGenres, onGenreChange }: GenreFilterProps) => {
  const { data: genresData, isLoading, error } = useGenres();
  const t = useTranslations();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const genreId = Number(value);
    const newSelectedGenres = checked
      ? [...selectedGenres, genreId]
      : selectedGenres.filter((id) => id !== genreId);

    onGenreChange(newSelectedGenres);
  };

  if (isLoading) return <GenreSkeleton />;
  if (error) return <div>{error.message}</div>;
  if (!genresData) return null;

  return (
    <div className="mb-4">
      <p className="font-medium text-lg" data-testid="label-filter">
        {t("filters.genres.label")}
      </p>
      {genresData.results.map((genre) => (
        <div key={genre.id} className="flex items-center">
          <Checkbox
            data-testid={`checkbox-${genre.id}`}
            name="genre"
            value={genre.id}
            checked={selectedGenres.includes(genre.id)}
            onChange={handleCheckboxChange}
            label={genre.name}
          />
        </div>
      ))}
    </div>
  );
};

const GenreSkeleton = () => (
  <div>
    <Skeleton className="h-6 w-1/2 mb-3" animated />
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
          <Skeleton className="h-4 w-3/4" animated />
        </div>
      ))}
    </div>
  </div>
);

export default GenreFilter;
