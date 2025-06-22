import React, { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelPosition?: "left" | "right";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, labelPosition = "right", className = "", ...props }, ref) => {
    return (
      <label className={`inline-flex items-center cursor-pointer ${className}`}>
        {label && labelPosition === "left" && (
          <span className="mr-2 text-sm text-gray-700">{label}</span>
        )}

        <div className="relative">
          <input ref={ref} type="checkbox" className="sr-only peer" {...props} />
          <div
            className={`
              w-5 h-5 rounded border-2 border-gray-300
              peer-focus:ring-2 ring-primary/50
              peer-checked:bg-primary peer-checked:border-primary
              peer-disabled:bg-gray-100 peer-disabled:border-gray-200
              transition-colors duration-200
              flex items-center justify-center
            `}
          >
            <svg
              className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {label && labelPosition === "right" && (
          <span className="ml-2 text-sm text-gray-700">{label}</span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
