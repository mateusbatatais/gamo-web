import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

interface PlatformFilterProps {
  selectedPlatforms: number[];
  onPlatformChange: (selectedPlatforms: number[]) => void;
}
interface CachedData<T> {
  timestamp: number;
  data: T;
}

interface PlatformResult {
  id: number;
  name: string;
}

interface PlatformResponse {
  count: number;
  results: PlatformResult[];
}

const PlatformFilter = ({ selectedPlatforms, onPlatformChange }: PlatformFilterProps) => {
  const [platforms, setPlatforms] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations();

  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoading(true);
      setError("");

      const CACHE_KEY = "platformsData";
      const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 1 mês em ms

      // Verificar cache válido
      const cachedData = localStorage.getItem(CACHE_KEY);
      const now = Date.now();

      if (cachedData) {
        const parsedCache: CachedData<PlatformResponse> = JSON.parse(cachedData);

        if (now - parsedCache.timestamp < ONE_MONTH_MS) {
          setPlatforms(
            parsedCache.data.results.map((p) => ({
              value: p.id,
              label: p.name,
            })),
          );
          setLoading(false);
          return;
        }
      }

      try {
        const data = await apiFetch<PlatformResponse>("/games/platforms");

        // Atualizar cache
        const cache: CachedData<PlatformResponse> = {
          timestamp: now,
          data: data,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

        setPlatforms(
          data.results.map((platform) => ({
            value: platform.id,
            label: platform.name,
          })),
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An error occurred while fetching platforms.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
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
    const platformId = Number(value);
    const newSelectedPlatforms = checked
      ? [...selectedPlatforms, platformId]
      : selectedPlatforms.filter((id) => id !== platformId);

    onPlatformChange(newSelectedPlatforms);
  };

  return (
    <div className="mb-4">
      <p className="font-medium text-lg" data-testid="label-filter">
        {t("filters.platforms.label")}
      </p>
      {platforms.map((platform) => (
        <div key={platform.value} className="flex items-center">
          <Checkbox
            data-testid={`checkbox-${platform.value}`}
            name="platform"
            value={platform.value}
            checked={selectedPlatforms.includes(platform.value)}
            onChange={handleCheckboxChange}
            label={platform.label}
          />
        </div>
      ))}
    </div>
  );
};

export default PlatformFilter;
