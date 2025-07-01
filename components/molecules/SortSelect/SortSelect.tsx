// components/molecules/SortSelect/SortSelect.tsx
import { Select } from "@/components/atoms/Select/Select";
import clsx from "clsx";

export interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SortSelect = ({ options, value, onChange, className }: SortSelectProps) => {
  return (
    <div className={clsx("relative", className)} data-testid="sort-select-container">
      <Select value={value} onChange={(e) => onChange(e.target.value)} options={options}></Select>
    </div>
  );
};
