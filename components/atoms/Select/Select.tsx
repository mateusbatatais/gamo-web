import React, { SelectHTMLAttributes } from "react";
import clsx from "clsx";

export type SelectSize = "sm" | "md" | "lg" | "xl";
export type SelectStatus = "default" | "success" | "danger" | "warning" | "info";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options: SelectOption[];
  error?: string;
  size?: SelectSize;
  status?: SelectStatus;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const sizeClasses: Record<SelectSize, string> = {
  sm: "py-1.5 px-2.5 text-sm",
  md: "py-2 px-3 text-base",
  lg: "py-2.5 px-4 text-lg",
  xl: "py-3 px-5 text-xl",
};

const statusClasses: Record<SelectStatus, string> = {
  default: "border-neutral-300 focus:border-primary-500 dark:border-neutral-600",
  success: "border-success-300 focus:border-success-500 dark:border-success-500",
  danger: "border-danger-300 focus:border-danger-500 dark:border-danger-500",
  warning: "border-warning-300 focus:border-warning-500 dark:border-warning-500",
  info: "border-info-300 focus:border-info-500 dark:border-info-500",
};

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-neutral-500 dark:text-neutral-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export function Select({
  label,
  options,
  error,
  size = "md",
  status = "default",
  icon,
  iconPosition = "left",
  className,
  disabled,
  ...rest
}: SelectProps) {
  const hasIcon = !!icon;
  const currentStatus = error ? "danger" : status;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className={clsx(
            "text-sm text-neutral-700 dark:text-neutral-200",
            disabled && "text-neutral-400 dark:text-neutral-500",
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {hasIcon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        )}

        <select
          disabled={disabled}
          className={clsx(
            "block w-full appearance-none rounded border pr-10 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50",
            "dark:bg-transparent dark:text-white dark:placeholder-neutral-400",
            sizeClasses[size],
            statusClasses[currentStatus],
            hasIcon && iconPosition === "left" ? "pl-10" : "pl-3",
            disabled
              ? "bg-neutral-100 cursor-not-allowed opacity-70 dark:bg-neutral-700"
              : "bg-white",
            className,
          )}
          {...rest}
        >
          <option value="" disabled hidden>
            Selecione...
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-neutral-800">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDownIcon />
        </div>

        {hasIcon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && <span className="text-danger-600 text-sm dark:text-danger-400">{error}</span>}
    </div>
  );
}
