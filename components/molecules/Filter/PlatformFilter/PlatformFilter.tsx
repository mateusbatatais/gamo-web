"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import usePlatforms from "@/hooks/filters/usePlatforms";

interface PlatformFilterProps {
  selectedPlatforms: number[];
  onPlatformChange: (selectedPlatforms: number[]) => void;
}

const PLATFORM_GROUPS_COLLAPSE_KEY = "platformGroupsCollapse";

const PlatformFilter = ({ selectedPlatforms, onPlatformChange }: PlatformFilterProps) => {
  const { data: platformsData, isLoading, error } = usePlatforms();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(PLATFORM_GROUPS_COLLAPSE_KEY);
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  const t = useTranslations();

  // Grupos prioritários
  const prioritySlugs = ["playstation", "xbox", "nintendo", "sega"];

  // Salvar estado de collapse no localStorage quando mudar
  const toggleGroup = (slug: string) => {
    setExpandedGroups((prev) => {
      const newState = { ...prev, [slug]: !prev[slug] };
      localStorage.setItem(PLATFORM_GROUPS_COLLAPSE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const platformId = Number(value);
    const newSelectedPlatforms = checked
      ? [...selectedPlatforms, platformId]
      : selectedPlatforms.filter((id) => id !== platformId);

    onPlatformChange(newSelectedPlatforms);
  };

  if (isLoading) return <PlatformSkeleton />;
  if (error) return <div>{error.message}</div>;
  if (!platformsData) return null;

  // Separar grupos prioritários e outros
  const priorityGroups = platformsData.results.filter((group) =>
    prioritySlugs.includes(group.slug),
  );
  const otherPlatforms = platformsData.results
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
        <div key={group.slug} className="mb-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          <button
            className="flex items-center w-full text-left font-medium text-gray-800 dark:text-gray-200"
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

      {otherPlatforms.length > 0 && (
        <div className="mb-2 mt-3">
          <button
            className="flex items-center w-full text-left font-medium text-gray-800 dark:text-gray-200"
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
