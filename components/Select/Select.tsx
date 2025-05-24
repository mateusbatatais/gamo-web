import React, { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export function Select({ label, options, error, ...rest }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-medium text-neutral-700">{label}</label>}
      <select
        className={`
          px-3 py-2 border rounded focus:outline-none 
          ${error ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}
        `}
        {...rest}
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  );
}
