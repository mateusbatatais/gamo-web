import { Home } from "lucide-react";
import React from "react";

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button
      className={`
        px-4 py-2
        bg-blue-600 text-white font-medium rounded
        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <Home />
      {label}
    </button>
  );
}
