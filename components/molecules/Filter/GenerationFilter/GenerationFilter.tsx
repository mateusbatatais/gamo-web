import { useTranslations } from "next-intl";
import React from "react";

interface GenerationFilterProps {
  selectedGenerations: string[];
  onGenerationChange: (selectedGenerations: string[]) => void;
}

const GenerationFilter = ({ selectedGenerations, onGenerationChange }: GenerationFilterProps) => {
  const t = useTranslations();
  const generations = [
    { value: "1", label: `${t("filters.generation.1")}` },
    { value: "2", label: `${t("filters.generation.2")}` },
    { value: "3", label: `${t("filters.generation.3")}` },
    { value: "4", label: `${t("filters.generation.4")}` },
    { value: "5", label: `${t("filters.generation.5")}` },
    { value: "6", label: `${t("filters.generation.6")}` },
    { value: "7", label: `${t("filters.generation.7")}` },
    { value: "8", label: `${t("filters.generation.8")}` },
    { value: "9", label: `${t("filters.generation.9")}` },
  ];

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedGenerations = checked
      ? [...selectedGenerations, value]
      : selectedGenerations.filter((generation) => generation !== value);

    onGenerationChange(newSelectedGenerations);
  };

  return (
    <div className="mb-4">
      <p className="font-medium text-lg">{t("filters.generation.label")}</p>
      {generations.map((generation) => (
        <div key={generation.value} className="flex items-center">
          <input
            type="checkbox"
            value={generation.value}
            checked={selectedGenerations.includes(generation.value)}
            onChange={handleCheckboxChange}
            id={generation.value}
            className="mr-2"
          />
          <label htmlFor={generation.value}>{generation.label}</label>
        </div>
      ))}
    </div>
  );
};

export default GenerationFilter;
