import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-medium text-neutral-700">{label}</label>}
      <input
        className={`
          px-3 py-2 border rounded focus:outline-none 
          ${error ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}
        `}
        {...rest}
      />
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  );
}
