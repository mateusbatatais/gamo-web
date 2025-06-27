import React, { forwardRef, useState } from "react";
import clsx from "clsx";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: boolean;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    children,
    label,
    description,
    error,
    containerClassName,
    checked: propsChecked,
    onChange,
    disabled,
    className,
    ...inputProps
  } = props;

  // Estado controlado/nao-controlado
  const [internalChecked, setInternalChecked] = useState(propsChecked || false);
  const checked = propsChecked !== undefined ? propsChecked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (propsChecked === undefined) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e);
  };

  return (
    <div className={clsx("flex flex-col", containerClassName)}>
      <label
        className={clsx(
          "inline-flex items-start cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div className="relative w-5 h-5 flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className={clsx(
              "absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer",
              className,
            )}
            {...inputProps}
          />

          {/* Quadrado do checkbox */}
          <div
            className={clsx(
              "absolute inset-0 border-2 rounded transition-colors",
              "flex items-center justify-center",
              error
                ? "border-danger"
                : checked
                  ? "border-primary-500"
                  : "border-gray-300 dark:border-gray-600",
              checked ? (error ? "bg-danger" : "bg-primary-500") : "bg-white dark:bg-gray-800",
              disabled && "bg-gray-100 dark:bg-gray-700",
            )}
          ></div>

          {/* Ícone de check */}
          <svg
            className={clsx(
              "absolute inset-0 w-full h-full text-white z-10 pointer-events-none transition-opacity",
              checked ? "opacity-100" : "opacity-0",
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="ml-2">
          {label && (
            <span
              className={clsx(
                "text-sm font-medium",
                error ? "text-danger" : "text-gray-700 dark:text-gray-300",
              )}
            >
              {label}
            </span>
          )}
          {children && !label && (
            <span
              className={clsx(
                "text-sm font-medium",
                error ? "text-danger" : "text-gray-700 dark:text-gray-300",
              )}
            >
              {children}
            </span>
          )}
        </div>
      </label>

      {description && (
        <span
          className={clsx(
            "text-xs mt-1 ml-7",
            error ? "text-danger" : "text-gray-500 dark:text-gray-400",
          )}
        >
          {description}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";
