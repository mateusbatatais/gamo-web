// components/molecules/Filter/GenreFilter.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import useGenres from "@/hooks/filters/useGenres";

interface GenreFilterProps {
  selectedGenres: number[];
  onGenreChange: (selectedGenres: number[]) => void;
}

const PRIORITY_GENRE_IDS = [4, 6, 1, 5, 2, 15];

const GenreFilter = ({ selectedGenres, onGenreChange }: GenreFilterProps) => {
  const { data: genresData, isLoading, error } = useGenres();
  const [showAll, setShowAll] = useState(false);
  const t = useTranslations();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const genreId = Number(value);
    const newSelectedGenres = checked
      ? [...selectedGenres, genreId]
      : selectedGenres.filter((id) => id !== genreId);

    onGenreChange(newSelectedGenres);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (isLoading) return <GenreSkeleton />;
  if (error) return <div>{error.message}</div>;
  if (!genresData) return null;

  const priorityGenres = genresData.results
    .filter((genre) => PRIORITY_GENRE_IDS.includes(genre.id))
    .sort((a, b) => PRIORITY_GENRE_IDS.indexOf(a.id) - PRIORITY_GENRE_IDS.indexOf(b.id));

  const remainingGenres = genresData.results
    .filter((genre) => !PRIORITY_GENRE_IDS.includes(genre.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mb-4">
      <p className="font-medium text-lg mb-2" data-testid="label-filter">
        {t("filters.genres.label")}
      </p>

      <div className="space-y-1">
        {priorityGenres.map((genre) => (
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

      {remainingGenres.length > 0 && (
        <div className="mt-2">
          {showAll ? (
            <div className="space-y-1">
              {remainingGenres.map((genre) => (
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
          ) : null}

          <button
            onClick={toggleShowAll}
            className="flex items-center mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <span>
              {showAll
                ? t("filters.showLess")
                : `${t("filters.showMore")} (${remainingGenres.length})`}
            </span>
            {showAll ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const GenreSkeleton = () => (
  <div>
    <Skeleton className="h-6 w-1/2 mb-3" animated />

    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
          <Skeleton className="h-4 w-3/4" animated />
        </div>
      ))}
    </div>

    <div className="mt-2 flex items-center">
      <Skeleton className="h-4 w-24 mr-1" animated />
      <Skeleton className="h-4 w-4" rounded="full" animated />
    </div>
  </div>
);

export default GenreFilter;
