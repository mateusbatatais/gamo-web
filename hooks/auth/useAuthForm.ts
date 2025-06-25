// src/hooks/auth/useAuthForm.ts
import { useState } from "react";

type FieldConfig = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  showToggle?: boolean;
};

type AuthFormConfig = {
  fields: FieldConfig[];
  submitLabel: string;
};

export function useAuthForm(config: AuthFormConfig) {
  const initialValues = config.fields.reduce((acc, field) => {
    return { ...acc, [field.name]: "" };
  }, {});

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return {
    values,
    loading,
    error,
    handleChange,
    setLoading,
    setError,
    config,
  };
}
