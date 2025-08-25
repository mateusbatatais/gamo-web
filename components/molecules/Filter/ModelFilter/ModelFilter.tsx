// components/molecules/Filter/ModelFilter/ModelFilter.tsx
"use client";

import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import useModels from "@/hooks/useModels";

interface ModelFilterProps {
  selectedModels: string[];
  onModelChange: (selectedModels: string[]) => void;
}

const ModelFilter = ({ selectedModels, onModelChange }: ModelFilterProps) => {
  const { data: models, isLoading, error } = useModels();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedModels = checked
      ? [...selectedModels, value]
      : selectedModels.filter((model) => model !== value);

    onModelChange(newSelectedModels);
  };

  if (isLoading) return <Skeleton className="h-6 w-full" />;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="mb-4">
      <p className="font-medium text-lg">Modelo</p>
      {models?.map((model) => (
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
  );
};

export default ModelFilter;
