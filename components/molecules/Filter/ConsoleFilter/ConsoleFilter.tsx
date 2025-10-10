// components/molecules/Filter/ConsoleFilter.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import useConsolesForFilter, { ConsoleForFilter } from "@/hooks/filters/useConsolesForFilter";

interface ConsoleFilterProps {
  selectedConsoles: string[];
  onConsoleChange: (selectedConsoles: string[]) => void;
  locale?: string;
}

// Marcas prioritárias (mesmo padrão do PlatformFilter)
const PRIORITY_BRANDS = ["nintendo", "sony", "sega", "microsoft"];

const CONSOLE_GROUPS_COLLAPSE_KEY = "consoleGroupsCollapse";

const ConsoleFilter = ({
  selectedConsoles,
  onConsoleChange,
  locale = "pt",
}: ConsoleFilterProps) => {
  const { data: consoles, isLoading, error } = useConsolesForFilter(locale);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CONSOLE_GROUPS_COLLAPSE_KEY);
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  const t = useTranslations();

  // Salvar estado de collapse no localStorage quando mudar
  const toggleGroup = (slug: string) => {
    setExpandedGroups((prev) => {
      const newState = { ...prev, [slug]: !prev[slug] };
      localStorage.setItem(CONSOLE_GROUPS_COLLAPSE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  // Agrupar consoles por marca
  const groupedConsoles = consoles?.reduce(
    (acc, console) => {
      const brandSlug = console.brand.slug;
      if (!acc[brandSlug]) {
        acc[brandSlug] = {
          name: console.brand.name,
          consoles: [],
        };
      }
      acc[brandSlug].consoles.push(console);
      return acc;
    },
    {} as Record<string, { name: string; consoles: ConsoleForFilter[] }>,
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedConsoles = checked
      ? [...selectedConsoles, value]
      : selectedConsoles.filter((consoleSlug) => consoleSlug !== value);

    onConsoleChange(newSelectedConsoles);
  };

  if (isLoading) return <ConsoleSkeleton />;
  if (error) return <div>{error.message}</div>;
  if (!groupedConsoles) return null;

  // Separar grupos prioritários e outros
  const priorityGroups = Object.entries(groupedConsoles).filter(([brandSlug]) =>
    PRIORITY_BRANDS.includes(brandSlug),
  );
  const otherConsoles = Object.entries(groupedConsoles)
    .filter(([brandSlug]) => !PRIORITY_BRANDS.includes(brandSlug))
    .flatMap(([, group]) => group.consoles)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mb-4">
      <p className="font-medium text-lg mb-2" data-testid="label-filter">
        {t("filters.console.label")}
      </p>

      {/* Grupos prioritários */}
      {priorityGroups.map(([brandSlug, group]) => (
        <div key={brandSlug} className="mb-2 border-b border-gray-200 dark:border-gray-800 pb-2">
          <button
            className="flex items-center w-full text-left font-medium text-gray-800 dark:text-gray-200"
            onClick={() => toggleGroup(brandSlug)}
            aria-expanded={!!expandedGroups[brandSlug]}
          >
            <span className="flex-1">{group.name}</span>
            {expandedGroups[brandSlug] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedGroups[brandSlug] && (
            <div className="mt-2 ml-2 space-y-1">
              {group.consoles.map((console) => (
                <div key={console.slug} className="flex items-center">
                  <Checkbox
                    data-testid={`checkbox-${console.slug}`}
                    name="console"
                    value={console.slug}
                    checked={selectedConsoles.includes(console.slug)}
                    onChange={handleCheckboxChange}
                    label={console.name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Grupo "Outros" */}
      {otherConsoles.length > 0 && (
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
              {otherConsoles.map((console) => (
                <div key={console.slug} className="flex items-center">
                  <Checkbox
                    data-testid={`checkbox-${console.slug}`}
                    name="console"
                    value={console.slug}
                    checked={selectedConsoles.includes(console.slug)}
                    onChange={handleCheckboxChange}
                    label={console.name}
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

// Skeleton loading consistente com PlatformFilter
const ConsoleSkeleton = () => (
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

export default ConsoleFilter;
