// components/organisms/AuthForm/AuthForm.tsx
"use client";

import React from "react";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { FieldError } from "@/@types/forms";

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  showToggle?: boolean;
}

interface AuthFormProps {
  config: {
    fields: FieldConfig[];
    submitLabel: string;
  };
  onSubmit: (values: Record<string, string>) => void;
  additionalContent?: React.ReactNode;
  loading?: boolean;
  errors?: Record<string, FieldError>; // Agora é um objeto com erros por campo
  values: Record<string, string>; // Adicionado valores
  onValueChange: (name: string, value: string) => void; // Adicionado handler de mudança
}

export function AuthForm({
  config,
  onSubmit,
  additionalContent,
  loading = false,
  errors = {},
  values,
  onValueChange,
}: AuthFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {config.fields.map((field) => (
        <Input
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          value={values[field.name] || ""}
          onChange={(e) => onValueChange(field.name, e.target.value)}
          required={field.required}
          showToggle={field.showToggle}
          error={errors[field.name]?.message} // Erro específico por campo
        />
      ))}

      {/* Erro geral (não associado a um campo específico) */}
      {errors.general && <p className="text-red-600 text-sm">{errors.general.message}</p>}

      <Button
        type="submit"
        label={loading ? "Carregando..." : config.submitLabel}
        variant="primary"
        className="w-full"
        disabled={loading}
      />

      {additionalContent}
    </form>
  );
}
