// components/molecules/Filter/ModelFilter/ModelFilter.tsx
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import useModels from "@/hooks/useModels";

interface ModelFilterProps {
  selectedModels: string[];
  onModelChange: (selectedModels: string[]) => void;
}

const ModelFilter = ({ selectedModels, onModelChange }: ModelFilterProps) => {
  const { data: models, isLoading, error } = useModels();
  const [showAll, setShowAll] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedModels = checked
      ? [...selectedModels, value]
      : selectedModels.filter((model) => model !== value);

    onModelChange(newSelectedModels);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (isLoading) return <ModelSkeleton />;
  if (error) return <div>{error.message}</div>;
  if (!models) return null;

  // Separar os 3 últimos modelos e o restante
  const lastThreeModels = models.slice(-3); // Últimos 3
  const remainingModels = models.slice(0, -3); // Todos exceto os últimos 3

  return (
    <div className="mb-4">
      <p className="font-medium text-lg mb-2">Modelo</p>

      {/* Últimos 3 modelos (sempre visíveis) */}
      <div className="space-y-1">
        {lastThreeModels.map((model) => (
          <div key={model.slug} className="flex items-center">
            <Checkbox
              name="model"
              value={model.slug}
              checked={selectedModels.includes(model.slug)}
              onChange={handleCheckboxChange}
              label={model.name}
            />
          </div>
        ))}
      </div>

      {/* Modelos restantes (colapsáveis) */}
      {remainingModels.length > 0 && (
        <div className="mt-2">
          {showAll ? (
            <div className="space-y-1">
              {remainingModels.map((model) => (
                <div key={model.slug} className="flex items-center">
                  <Checkbox
                    name="model"
                    value={model.slug}
                    checked={selectedModels.includes(model.slug)}
                    onChange={handleCheckboxChange}
                    label={model.name}
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
            <span>{showAll ? "Exibir menos" : `Exibir mais (${remainingModels.length})`}</span>
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

// Skeleton loading atualizado
const ModelSkeleton = () => (
  <div>
    <Skeleton className="h-6 w-1/2 mb-3" animated />

    {/* Últimos 3 modelos */}
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2" rounded="sm" animated />
          <Skeleton className="h-4 w-3/4" animated />
        </div>
      ))}
    </div>

    {/* Botão "Exibir mais" skeleton */}
    <div className="mt-2 flex items-center">
      <Skeleton className="h-4 w-24 mr-1" animated />
      <Skeleton className="h-4 w-4" rounded="full" animated />
    </div>
  </div>
);

export default ModelFilter;
