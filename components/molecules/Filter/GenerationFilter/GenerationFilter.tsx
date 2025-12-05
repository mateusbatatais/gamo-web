// components/molecules/Filter/GenerationFilter.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";

interface GenerationFilterProps {
  selectedGenerations: string[];
  onGenerationChange: (selectedGenerations: string[]) => void;
}

const GenerationFilter = ({ selectedGenerations, onGenerationChange }: GenerationFilterProps) => {
  const [showAll, setShowAll] = useState(false);
  const t = useTranslations();

  // Lista completa de gerações (da 1ª à 9ª) - invertida
  const allGenerations = [
    { value: "9", label: `${t("filters.generation.9")}` },
    { value: "8", label: `${t("filters.generation.8")}` },
    { value: "7", label: `${t("filters.generation.7")}` },
    { value: "6", label: `${t("filters.generation.6")}` },
    { value: "5", label: `${t("filters.generation.5")}` },
    { value: "4", label: `${t("filters.generation.4")}` },
    { value: "3", label: `${t("filters.generation.3")}` },
    { value: "2", label: `${t("filters.generation.2")}` },
    { value: "1", label: `${t("filters.generation.1")}` },
  ];

  // Separar as 3 primeiras (que serão as últimas gerações) e o restante
  const defaultVisible = allGenerations.slice(0, 3);
  const others = allGenerations.slice(3);

  // Visíveis: Padrão + Selecionados que estariam escondidos
  const firstThreeGenerations = [
    ...defaultVisible,
    ...others.filter((g) => selectedGenerations.includes(g.value)),
  ];

  // Restante: Outros - Selecionados
  const remainingGenerations = others.filter((g) => !selectedGenerations.includes(g.value));

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedGenerations = checked
      ? [...selectedGenerations, value]
      : selectedGenerations.filter((generation) => generation !== value);

    onGenerationChange(newSelectedGenerations);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="mb-4">
      <p className="font-medium text-lg mb-2" data-testid="label-filter">
        {t("filters.generation.label")}
      </p>

      {/* Primeiras 3 gerações (últimas gerações - sempre visíveis) */}
      <div className="space-y-1">
        {firstThreeGenerations.map((generation) => (
          <div key={generation.value} className="flex items-center">
            <Checkbox
              data-testid={`checkbox-${generation.value}`}
              name="generation"
              value={generation.value}
              checked={selectedGenerations.includes(generation.value)}
              onChange={handleCheckboxChange}
              label={generation.label}
            />
          </div>
        ))}
      </div>

      {/* Gerações restantes (colapsáveis) */}
      {remainingGenerations.length > 0 && (
        <div className="mt-2">
          {showAll ? (
            <div className="space-y-1">
              {remainingGenerations.map((generation) => (
                <div key={generation.value} className="flex items-center">
                  <Checkbox
                    data-testid={`checkbox-${generation.value}`}
                    name="generation"
                    value={generation.value}
                    checked={selectedGenerations.includes(generation.value)}
                    onChange={handleCheckboxChange}
                    label={generation.label}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {/* Botão "Exibir mais/menos" */}
          <button
            onClick={toggleShowAll}
            className="flex items-center mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <span>
              {showAll
                ? t("filters.showLess")
                : `${t("filters.showMore")} (${remainingGenerations.length})`}
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

export default GenerationFilter;
