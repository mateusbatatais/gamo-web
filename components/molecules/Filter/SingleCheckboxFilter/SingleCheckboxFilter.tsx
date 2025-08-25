// components/molecules/Filter/SingleCheckboxFilter/SingleCheckboxFilter.tsx
"use client";

import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";

interface SingleCheckboxFilterProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const SingleCheckboxFilter = ({
  label,
  checked,
  onChange,
  description,
}: SingleCheckboxFilterProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center">
        <Checkbox
          name={label.toLowerCase().replace(" ", "-")}
          checked={checked}
          onChange={handleChange}
          label={label}
        />
      </div>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
};

export default SingleCheckboxFilter;
