// components/organisms/AddToCollectionForm/AddToCollectionForm.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { apiFetch } from "@/utils/api";
import { useTranslations } from "next-intl";
import { Select } from "@/components/atoms/Select/Select";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface AddToCollectionFormProps {
  consoleVariantId: number;
  skinId: number;
  consoleId: number;
  initialStatus: "OWNED" | "TRADE";
  onSuccess: () => void;
}

export function AddToCollectionForm({
  consoleVariantId,
  skinId,
  consoleId,
  initialStatus,
  onSuccess,
}: AddToCollectionFormProps) {
  const { token } = useAuth();
  const t = useTranslations("Collection");
  const [formData, setFormData] = useState({
    description: "",
    status: "OWNED" as "OWNED" | "TRADE",
    price: "",
    hasBox: false,
    hasManual: false,
    condition: "NEW" as "NEW" | "USED" | "REFURBISHED",
    acceptsTrade: false,
    photoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch("/user-consoles", {
        method: "POST",
        token,
        body: {
          consoleVariantId,
          consoleId,
          skinId,
          ...formData,
          price: formData.price ? parseFloat(formData.price) : undefined,
        },
      });
      onSuccess();
      showToast(t("success"), "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        showToast(err.message, "danger");
      } else {
        setError("Ocorreu um erro ao adicionar à coleção");
        showToast("err.message", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const conditionOptions = [
    { value: "NEW", label: t("conditionNew") },
    { value: "USED", label: t("conditionUsed") },
    { value: "REFURBISHED", label: t("conditionRefurbished") },
  ];

  const statusOptions = [
    { value: "OWNED", label: t("statusOwned") },
    { value: "SELLING", label: t("statusSelling") },
    { value: "LOOKING_FOR", label: t("statusLookingFor") },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>{initialStatus}</div>

      <div>
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
          label={t("status")}
          options={statusOptions}
        ></Select>
      </div>
      <div>
        <Select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          label={t("condition")}
          options={conditionOptions}
        ></Select>
      </div>

      {formData.status === "TRADE" && (
        <div>
          <Input
            label={t("price")}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      )}

      <div className="space-y-2">
        <Checkbox
          name="hasBox"
          checked={formData.hasBox}
          onChange={handleChange}
          label={t("hasBox")}
        />

        <Checkbox
          name="hasManual"
          checked={formData.hasManual}
          onChange={handleChange}
          label={t("hasManual")}
        />

        <Checkbox
          name="acceptsTrade"
          checked={formData.acceptsTrade}
          onChange={handleChange}
          label={t("acceptsTrade")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("description")}</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder={t("descriptionPlaceholder")}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="transparent"
          status="warning"
          onClick={onSuccess}
          label={t("cancel")}
        ></Button>
        <Button type="submit" disabled={loading} label={loading ? t("adding") : t("add")}></Button>
      </div>
    </form>
  );
}
