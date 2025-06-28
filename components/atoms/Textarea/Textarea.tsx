"use client";

import React, { TextareaHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

export type TextareaSize = "sm" | "md" | "lg";
export type TextareaStatus = "default" | "success" | "danger" | "warning" | "info";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  size?: TextareaSize;
  status?: TextareaStatus;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const sizeClasses: Record<TextareaSize, string> = {
  sm: "text-sm px-2.5 py-1.5",
  md: "text-base px-3 py-2.5",
  lg: "text-lg px-4 py-3",
};

const statusClasses: Record<TextareaStatus, string> = {
  default: "border-gray-300 focus:border-primary-500 dark:border-gray-600",
  success: "border-success-300 focus:border-success-500 dark:border-success-500",
  danger: "border-danger-300 focus:border-danger-500 dark:border-danger-500",
  warning: "border-warning-300 focus:border-warning-500 dark:border-warning-500",
  info: "border-info-300 focus:border-info-500 dark:border-info-500",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      size = "md",
      status = "default",
      icon,
      iconPosition = "left",
      className,
      rows = 4,
      id,
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();
    const textareaId = id || `textarea-${uniqueId}`;
    const currentStatus = error ? "danger" : status;
    const hasIcon = !!icon;

    const textareaClasses = clsx(
      "block w-full border rounded-md transition focus:outline-none resize-y",
      "focus:ring-2 focus:ring-opacity-20 focus:ring-primary-300 dark:focus:ring-primary-400",
      sizeClasses[size],
      statusClasses[currentStatus],
      {
        "pl-10": hasIcon && iconPosition === "left",
        "pr-10": hasIcon && iconPosition === "right",
        // Fundo e texto para estados normais
        "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100": !props.disabled,
        // Fundo e texto para estados desabilitados
        "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400":
          props.disabled,
      },
      className,
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500">{icon}</div>
          )}

          <textarea ref={ref} id={textareaId} rows={rows} className={textareaClasses} {...props} />

          {icon && iconPosition === "right" && (
            <div className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500">{icon}</div>
          )}
        </div>

        {error && (
          <p
            className="mt-1.5 text-sm text-danger-600 dark:text-danger-400"
            data-testid="textarea-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
