"use client";

import React, { TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type InputSize = "sm" | "md" | "lg";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  inputSize?: InputSize;
}

const sizeClasses: Record<InputSize, string> = {
  sm: "text-sm px-2 py-1",
  md: "text-base px-3 py-2",
  lg: "text-lg px-4 py-3",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, inputSize = "md", className, rows = 4, ...props }, ref) => {
    const textareaClasses = clsx(
      "block w-full border rounded-md transition focus:outline-none resize vertical",
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
      },
      className,
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        <textarea ref={ref} rows={rows} className={textareaClasses} {...props} />

        {error && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400" data-testid="textarea-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
