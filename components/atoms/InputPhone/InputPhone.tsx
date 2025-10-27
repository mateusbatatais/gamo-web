// components/atoms/InputPhone/InputPhone.tsx
"use client";

import React, { InputHTMLAttributes, forwardRef, useState, useEffect } from "react";
import PhoneInput, { Country, isValidPhoneNumber } from "react-phone-number-input";
import clsx from "clsx";
import "react-phone-number-input/style.css";

// Tipo para os países suportados (ISO 3166-1 alpha-2)
export type CountryCode = Country;

export interface InputPhoneProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  defaultCountry?: CountryCode;
  required?: boolean;
  validateOnChange?: boolean;
}

export const InputPhone = forwardRef<HTMLInputElement, InputPhoneProps>(
  (
    {
      label,
      error,
      value,
      onChange,
      onValidityChange,
      defaultCountry = "BR" as CountryCode,
      className,
      disabled,
      required,
      validateOnChange = true,
      ...props
    },
    ref,
  ) => {
    const [isValid, setIsValid] = useState(true);
    const [isTouched, setIsTouched] = useState(false);

    useEffect(() => {
      if (value && validateOnChange) {
        const valid = isValidPhoneNumber(value);
        setIsValid(valid);
        onValidityChange?.(valid);
      }
    }, [value, validateOnChange, onValidityChange]);

    const handleChange = (phoneValue: string | undefined) => {
      setIsTouched(true);

      if (onChange) {
        onChange(phoneValue || "");
      }

      if (validateOnChange && phoneValue) {
        const valid = isValidPhoneNumber(phoneValue);
        setIsValid(valid);
        onValidityChange?.(valid);
      } else {
        setIsValid(true);
      }
    };

    const showError = error || (isTouched && !isValid);

    const inputClasses = clsx(
      "block w-full border rounded-md transition focus:outline-none",
      "placeholder-gray-400 dark:placeholder-gray-500",
      "py-2 px-3 text-base",
      {
        // borda / foco normal
        "border-gray-300 focus:border-primary-500": !showError,
        "dark:border-gray-700 dark:focus:border-primary-400": !showError,

        // borda / foco de erro
        "border-red-500 focus:border-red-500": showError,
        "dark:border-red-400 dark:focus:border-red-300": showError,

        // fundo / texto padrão
        "bg-white text-gray-900": !disabled,
        "dark:bg-gray-800 dark:text-gray-100": !disabled,

        // fundo / texto quando desabilitado
        "bg-gray-100 text-gray-500 cursor-not-allowed": disabled,
        "dark:bg-gray-700 dark:text-gray-400": disabled,
      },
      className,
    );

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            className={clsx(
              "text-sm text-neutral-700 dark:text-neutral-200",
              disabled && "text-neutral-400 dark:text-neutral-500",
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry={defaultCountry}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={inputClasses}
            numberInputProps={{
              ref,
              className: "bg-transparent outline-none w-full",
              onBlur: () => setIsTouched(true),
              ...props,
            }}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400" data-testid="input-error">
            {error}
          </p>
        )}

        {!isValid && !error && isTouched && (
          <p
            className="mt-1 text-sm text-yellow-600 dark:text-yellow-400"
            data-testid="phone-validation-error"
          >
            Número de telefone inválido
          </p>
        )}
      </div>
    );
  },
);

InputPhone.displayName = "InputPhone";
