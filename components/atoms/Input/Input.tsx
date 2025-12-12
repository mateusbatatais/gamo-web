// components/Input/Input.tsx
"use client";

import React, { InputHTMLAttributes, ReactNode, forwardRef, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

type InputSize = "sm" | "md" | "lg" | "xl";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  inputSize?: InputSize;
  showToggle?: boolean;
  rightElement?: ReactNode;
}

const sizeClasses: Record<InputSize, string> = {
  sm: "py-1.5 px-2.5 text-sm",
  md: "py-2 px-3 text-base",
  lg: "py-2.5 px-4 text-lg",
  xl: "py-3 px-5 text-xl",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      inputSize = "md",
      showToggle = false,
      rightElement,
      className,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    const actualType = showToggle && type === "password" ? (isVisible ? "text" : "password") : type;

    const inputClasses = clsx(
      "block w-full border rounded-md transition focus:outline-none",
      "placeholder-gray-400 dark:placeholder-gray-500",
      sizeClasses[inputSize],
      {
        // borda / foco normal
        "border-gray-300 focus:border-primary-500": !error,
        "dark:border-gray-700 dark:focus:border-primary-400": !error,

        // borda / foco de erro
        "border-red-500 focus:border-red-500": error,
        "dark:border-red-400 dark:focus:border-red-300": error,

        // fundo / texto padrão
        "bg-white text-gray-900": !props.disabled,
        "dark:bg-gray-800 dark:text-gray-100": !props.disabled,

        // fundo / texto quando desabilitado
        "bg-gray-100 text-gray-500 cursor-not-allowed": props.disabled,
        "dark:bg-gray-700 dark:text-gray-400": props.disabled,

        // Espaçamento extra quando houver ícone ou toggle
        "pl-10": icon,
        "pr-10": (showToggle && type === "password") || rightElement,
      },
      className,
    );

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            className={clsx(
              "text-sm text-neutral-700 dark:text-neutral-200",
              props.disabled && "text-neutral-400 dark:text-neutral-500",
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              {icon}
            </div>
          )}

          <input ref={ref} type={actualType} className={inputClasses} {...props} />

          {showToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setIsVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
              aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
            >
              {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400" data-testid="input-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
