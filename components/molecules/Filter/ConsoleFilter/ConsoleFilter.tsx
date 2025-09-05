// components/molecules/Filter/ConsoleFilter.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { ChevronUp, ChevronDown } from "lucide-react";
import useConsolesForFilter, { ConsoleForFilter } from "@/hooks/filters/useConsolesForFilter";

interface ConsoleFilterProps {
  selectedConsoles: string[];
  onConsoleChange: (selectedConsoles: string[]) => void;
  locale?: string;
}

const ConsoleFilter = ({
  selectedConsoles,
  onConsoleChange,
  locale = "pt",
}: ConsoleFilterProps) => {
  const { data: consoles, isLoading, error } = useConsolesForFilter(locale);
  const t = useTranslations();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

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

  const toggleGroup = (groupSlug: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupSlug]: !prev[groupSlug],
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedConsoles = checked
      ? [...selectedConsoles, value]
      : selectedConsoles.filter((consoleSlug) => consoleSlug !== value);

    onConsoleChange(newSelectedConsoles);
  };

  if (isLoading)
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

  if (error) return <div>{error.message}</div>;
  if (!groupedConsoles) return null;

  return (
    <div className="mb-4">
      <p className="font-medium text-lg mb-2">{t("filters.console.label")}</p>
      <div className="space-y-2">
        {Object.entries(groupedConsoles).map(([brandSlug, group]) => (
          <div key={brandSlug}>
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
      </div>
    </div>
  );
};

export default ConsoleFilter;
