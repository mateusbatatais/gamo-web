import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PlatformFilterProps {
  selectedPlatforms: number[];
  onPlatformChange: (selectedPlatforms: number[]) => void;
}

interface CachedData<T> {
  timestamp: number;
  data: T;
}

interface Platform {
  id: number;
  name: string;
}

interface ParentPlatform {
  id: number;
  name: string;
  slug: string;
  platforms: Platform[];
}

interface PlatformResponse {
  count: number;
  results: ParentPlatform[];
}

const PLATFORM_CACHE_KEY = "platformsData";
const COLLAPSE_STATE_KEY = "platformCollapseState";

const PlatformFilter = ({ selectedPlatforms, onPlatformChange }: PlatformFilterProps) => {
  const [platformGroups, setPlatformGroups] = useState<ParentPlatform[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Inicializar o estado diretamente com o localStorage
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(COLLAPSE_STATE_KEY);
        return saved ? JSON.parse(saved) : {};
      } catch (e) {
        console.error("Failed to parse collapse state", e);
        return {};
      }
    }
    return {};
  });

  const t = useTranslations();

  // Grupos prioritários
  const prioritySlugs = ["playstation", "xbox", "nintendo", "sega"];

  // Salvar estado de collapse no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem(COLLAPSE_STATE_KEY, JSON.stringify(expandedGroups));
  }, [expandedGroups]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoading(true);
      setError("");

      const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      // Verificar cache de dados
      const cachedData = localStorage.getItem(PLATFORM_CACHE_KEY);

      if (cachedData) {
        const parsedCache: CachedData<PlatformResponse> = JSON.parse(cachedData);
        if (now - parsedCache.timestamp < ONE_MONTH_MS) {
          setPlatformGroups(parsedCache.data.results);
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
        localStorage.setItem(PLATFORM_CACHE_KEY, JSON.stringify(cache));

        setPlatformGroups(data.results);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const platformId = Number(value);
    const newSelectedPlatforms = checked
      ? [...selectedPlatforms, platformId]
      : selectedPlatforms.filter((id) => id !== platformId);

    onPlatformChange(newSelectedPlatforms);
  };

  const toggleGroup = (slug: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  if (loading) return <PlatformSkeleton />;
  if (error) return <div>{error}</div>;

  // Separar grupos prioritários e outros
  const priorityGroups = platformGroups.filter((group) => prioritySlugs.includes(group.slug));

  // Juntar todas as plataformas de grupos não prioritários
  const otherPlatforms = platformGroups
    .filter((group) => !prioritySlugs.includes(group.slug))
    .flatMap((group) => group.platforms)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mb-4">
      <p className="font-medium text-lg mb-2" data-testid="label-filter">
        {t("filters.platforms.label")}
      </p>

      {/* Grupos prioritários */}
      {priorityGroups.map((group) => (
        <div key={group.slug} className="mb-2 border-b border-gray-200 dark:border-gray-800 pb-2 ">
          <button
            className="flex items-center w-full text-left font-medium text-gray-800 dark:text-gray-200 "
            onClick={() => toggleGroup(group.slug)}
            aria-expanded={!!expandedGroups[group.slug]}
          >
            <span className="flex-1">{group.name}</span>
            {expandedGroups[group.slug] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedGroups[group.slug] && (
            <div className="mt-2 ml-2 space-y-1">
              {group.platforms.map((platform) => (
                <div key={platform.id} className="flex items-center">
                  <Checkbox
                    data-testid={`checkbox-${platform.id}`}
                    name="platform"
                    value={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={handleCheckboxChange}
                    label={platform.name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Grupo "Outros" - somente se houver plataformas */}
      {otherPlatforms.length > 0 && (
        <div className="mb-2 mt-3">
          <button
            className="flex items-center w-full text-left font-medium text-gray-800 hover:text-gray-900"
            onClick={() => toggleGroup("others")}
            aria-expanded={!!expandedGroups["others"]}
          >
            <span className="flex-1">Outros</span>
            {expandedGroups["others"] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedGroups["others"] && (
            <div className="mt-2 ml-2 space-y-1">
              {otherPlatforms.map((platform) => (
                <div key={platform.id} className="flex items-center">
                  <Checkbox
                    data-testid={`checkbox-${platform.id}`}
                    name="platform"
                    value={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={handleCheckboxChange}
                    label={platform.name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente de Skeleton atualizado
const PlatformSkeleton = () => (
  <div>
    <Skeleton className="h-6 w-1/2 mb-3" animated />

    {/* Skeleton para grupos prioritários */}
    {[...Array(4)].map((_, i) => (
      <div key={i} className="mb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-1/3 mb-2" animated />
          <Skeleton className="h-4 w-4" rounded="full" animated />
        </div>
        <div className="ml-3 space-y-2">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
              <Skeleton className="h-4 w-3/4" animated />
            </div>
          ))}
        </div>
      </div>
    ))}

    {/* Skeleton para grupo "Outros" */}
    <div className="mt-4 pt-3 border-t">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/4 mb-2" animated />
        <Skeleton className="h-4 w-4" rounded="full" animated />
      </div>
      <div className="ml-3 mt-2 space-y-2">
        {[...Array(5)].map((_, j) => (
          <div key={j} className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
            <Skeleton className="h-4 w-3/4" animated />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PlatformFilter;
