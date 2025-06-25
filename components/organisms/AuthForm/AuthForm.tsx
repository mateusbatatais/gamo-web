// src/components/organisms/AuthForm/AuthForm.tsx
import React from "react";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import { useToast } from "@/contexts/ToastContext";

interface AuthFormProps {
  config: {
    fields: {
      name: string;
      label: string;
      type: string;
      placeholder: string;
      required?: boolean;
      showToggle?: boolean;
    }[];
    submitLabel: string;
  };
  onSubmit: (values: Record<string, string>) => Promise<void>;
  additionalContent?: React.ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({ config, onSubmit, additionalContent }) => {
  const { values, loading, error, handleChange, setLoading, setError } = useAuthForm(config);
  const { showToast } = useToast(); // Hook de toast

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(values);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred");
        showToast(err.message, "danger");
      } else {
        setError("An error occurred");
        showToast("An error occurred", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {config.fields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          value={values[field.name]}
          onChange={(e) => handleChange(field.name, e.target.value)}
          required={field.required}
          showToggle={field.showToggle}
          error={error ? error : undefined}
        />
      ))}

      <Button
        type="submit"
        label={loading ? "Loading..." : config.submitLabel}
        variant="primary"
        disabled={loading}
        className="w-full"
      />

      {additionalContent}
    </form>
  );
};
