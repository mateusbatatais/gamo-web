// components/molecules/Filter/TypeFilter/TypeFilter.tsx
"use client";

import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeChange: (selectedTypes: string[]) => void;
}

const typeOptions = [
  { value: "desktop", label: "Desktop" },
  { value: "handheld", label: "Portátil" },
  { value: "hybrid", label: "Híbrido" },
];

const TypeFilter = ({ selectedTypes, onTypeChange }: TypeFilterProps) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newSelectedTypes = checked
      ? [...selectedTypes, value]
      : selectedTypes.filter((type) => type !== value);

    onTypeChange(newSelectedTypes);
  };

  return (
    <div className="mb-4">
      <p className="font-medium text-lg">Tipo</p>
      {typeOptions.map((type) => (
        <div key={type.value} className="flex items-center">
          <Checkbox
            name="type"
            value={type.value}
            checked={selectedTypes.includes(type.value)}
            onChange={handleCheckboxChange}
            label={type.label}
          />
        </div>
      ))}
    </div>
  );
};

export default TypeFilter;
