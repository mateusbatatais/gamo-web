// components/molecules/Filter/GenreFilter.tsx
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { useTranslations } from "next-intl";
import React from "react";

interface GenreFilterProps {
  selectedGenres: string[];
  onGenreChange: (selectedGenres: string[]) => void;
}

const GenreFilter = ({ selectedGenres, onGenreChange }: GenreFilterProps) => {
  const t = useTranslations();
  // Esta lista pode vir de uma API ou ser estática
  const genres = [
    { value: "action", label: t("filters.genres.action") },
    { value: "adventure", label: t("filters.genres.adventure") },
    { value: "rpg", label: t("filters.genres.rpg") },
    { value: "strategy", label: t("filters.genres.strategy") },
    { value: "sports", label: t("filters.genres.sports") },
  ];

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedGenres = checked
      ? [...selectedGenres, value]
      : selectedGenres.filter((genre) => genre !== value);

    onGenreChange(newSelectedGenres);
  };

  return (
    <div className="mb-4">
      <p className="font-medium text-lg">{t("filters.genres.label")}</p>
      {genres.map((genre) => (
        <div key={genre.value} className="flex items-center">
          <Checkbox
            name="genre"
            value={genre.value}
            checked={selectedGenres.includes(genre.value)}
            onChange={handleCheckboxChange}
            label={genre.label}
          />
        </div>
      ))}
    </div>
  );
};

export default GenreFilter;
