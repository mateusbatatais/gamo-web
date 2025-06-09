import React, { useState, useRef, useEffect, ReactNode } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { Button } from "../Button/Button";

export interface DropdownOption {
  value: string;
  label: ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  selected: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select...",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = options.find((o) => o.value === selected)?.label;

  return (
    <div className={clsx("relative inline-block text-left")} ref={ref}>
      <Button
        onClick={() => setOpen((v) => !v)}
        label={currentLabel?.toString() ?? placeholder}
        icon={<ChevronDown aria-hidden="true" />}
        variant="transparent"
        iconPosition="right"
      />

      {open && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
          <ul className="max-h-60 overflow-auto py-1">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className={clsx(
                    "w-full text-left px-3 py-2 text-sm",
                    selected === opt.value
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                  )}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
