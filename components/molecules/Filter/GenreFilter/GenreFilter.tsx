import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

interface GenreFilterProps {
  selectedGenres: number[];
  onGenreChange: (selectedGenres: number[]) => void;
}

interface CachedData<T> {
  timestamp: number;
  data: T;
}

interface GenreResult {
  id: number;
  name: string;
}

interface GenreResponse {
  count: number;
  results: GenreResult[];
}

const GenreFilter = ({ selectedGenres, onGenreChange }: GenreFilterProps) => {
  const [genres, setGenres] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations();

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError("");

      const CACHE_KEY = "genresData";
      const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

      const cachedData = localStorage.getItem(CACHE_KEY);
      const now = Date.now();

      if (cachedData) {
        const parsedCache: CachedData<GenreResponse> = JSON.parse(cachedData);

        if (now - parsedCache.timestamp < ONE_MONTH_MS) {
          setGenres(
            parsedCache.data.results.map((g) => ({
              value: g.id,
              label: g.name,
            })),
          );
          setLoading(false);
          return;
        }
      }

      try {
        const data = await apiFetch<GenreResponse>("/games/genres");

        const cache: CachedData<GenreResponse> = {
          timestamp: now,
          data: data,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

        setGenres(
          data.results.map((genre) => ({
            value: genre.id,
            label: genre.name,
          })),
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An error occurred while fetching genres.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading)
    return (
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

  if (error) return <div>{error}</div>;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const genreId = Number(value);
    const newSelectedGenres = checked
      ? [...selectedGenres, genreId]
      : selectedGenres.filter((id) => id !== genreId);

    onGenreChange(newSelectedGenres);
  };

  return (
    <div className="mb-4">
      <p className="font-medium text-lg" data-testid="label-filter">
        {t("filters.genres.label")}
      </p>
      {genres.map((genre) => (
        <div key={genre.value} className="flex items-center">
          <Checkbox
            data-testid={`checkbox-${genre.value}`}
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
