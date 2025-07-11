import React, { forwardRef, useState } from "react";
import clsx from "clsx";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: boolean;
  containerClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const {
    label,
    description,
    error,
    containerClassName,
    checked: propsChecked,
    onChange: propsOnChange,
    disabled,
    className,
    ...inputProps
  } = props;

  const [internalChecked, setInternalChecked] = useState(propsChecked || false);
  const isControlled = propsChecked !== undefined;
  const checked = isControlled ? propsChecked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      if (!isControlled) {
        setInternalChecked(true);
      }

      propsOnChange?.(e);
    }
  };

  return (
    <div
      className={clsx("flex flex-col", containerClassName)}
      role="radio"
      tabIndex={disabled ? -1 : 0}
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={(e) => {
        if (!disabled && !checked) {
          const fakeEvent = {
            ...e,
            target: {
              ...e.target,
              checked: true,
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          handleChange(fakeEvent);
        }
      }}
      onKeyDown={(e) => {
        if (!disabled && !checked && (e.key === " " || e.key === "Enter")) {
          e.preventDefault();
          const fakeEvent = {
            ...e,
            target: {
              ...e.target,
              checked: true,
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          handleChange(fakeEvent);
        }
      }}
    >
      <label
        className={clsx(
          "inline-flex items-start cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div className="relative w-5 h-5 flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="radio"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className={clsx(
              "absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer",
              className,
            )}
            {...inputProps}
          />

          <div
            className={clsx(
              "absolute inset-0 border-2 rounded-full transition-colors",
              "flex items-center justify-center",
              error
                ? "border-danger"
                : checked
                  ? "border-primary-500"
                  : "border-gray-300 dark:border-gray-600",
              disabled && "bg-gray-100 dark:bg-gray-700",
            )}
          ></div>

          {checked && (
            <div
              className={clsx(
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                "w-2.5 h-2.5 rounded-full z-10 transition-colors",
                error ? "bg-danger" : "bg-primary-500",
              )}
            ></div>
          )}
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

Radio.displayName = "Radio";
