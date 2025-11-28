// components/organisms/_game/MatchFieldEditor/MatchFieldEditor.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ImportMatch } from "@/hooks/useGameImport";
import { CollectionStatus, MediaType, Condition } from "@/@types/collection.types";
import { Select } from "@/components/atoms/Select/Select";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";

interface MatchFieldEditorProps {
  match: ImportMatch;
  onUpdate: () => void;
}

export function MatchFieldEditor({ match, onUpdate }: MatchFieldEditorProps) {
  const t = useTranslations("GameImport.confirmation");
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Garantir que userData existe
  const userData = match.userData || {};

  // Estados locais para os campos com valores padrão
  const [status, setStatus] = useState<CollectionStatus>(userData.status || "OWNED");
  const [media, setMedia] = useState<MediaType>(userData.media || "PHYSICAL");
  const [condition, setCondition] = useState<Condition>(userData.condition || "USED");
  const [progress, setProgress] = useState<number | "">(userData.progress ?? "");
  const [rating, setRating] = useState<number | "">(userData.rating ?? "");
  const [price, setPrice] = useState<number | "">(userData.price ?? "");
  const [hasBox, setHasBox] = useState(userData.hasBox ?? false);
  const [hasManual, setHasManual] = useState(userData.hasManual ?? false);
  const [acceptsTrade, setAcceptsTrade] = useState(userData.acceptsTrade ?? false);
  const [description, setDescription] = useState(userData.description || "");
  const [priceError, setPriceError] = useState("");

  const handleSave = async () => {
    // Validar preço obrigatório quando status é SELLING
    if (status === "SELLING" && (price === "" || price === 0)) {
      setPriceError(t("fields.priceRequired") || "Preço é obrigatório para venda");
      showToast(t("fields.priceRequired") || "Preço é obrigatório para venda", "danger");
      return;
    }

    setPriceError("");
    setIsSaving(true);
    try {
      await apiFetch(`/user-games-import/match/${match.id}/fields`, {
        method: "PUT",
        body: {
          status,
          media,
          condition,
          progress: progress !== "" ? Number(progress) : undefined,
          rating: rating !== "" ? Number(rating) : undefined,
          price: price !== "" ? Number(price) : undefined,
          hasBox,
          hasManual,
          acceptsTrade,
          description: description || undefined,
        },
      });
      showToast(t("fields.saveSuccess") || "Campos atualizados!", "success");
      onUpdate();
      setIsExpanded(false);
    } catch (error) {
      console.error("Error updating match fields:", error);
      showToast(t("fields.saveError") || "Erro ao salvar", "danger");
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: "OWNED", label: t("statusValues.owned") },
    { value: "SELLING", label: t("statusValues.selling") },
    { value: "LOOKING_FOR", label: t("statusValues.looking_for") },
    { value: "PREVIOUSLY_OWNED", label: t("statusValues.previously_owned") },
  ];

  const mediaOptions = [
    { value: "PHYSICAL", label: t("mediaValues.physical") },
    { value: "DIGITAL", label: t("mediaValues.digital") },
  ];

  const conditionOptions = [
    { value: "NEW", label: t("conditionValues.new") },
    { value: "USED", label: t("conditionValues.used") },
    { value: "REFURBISHED", label: t("conditionValues.refurbished") },
  ];

  return (
    <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
      >
        {isExpanded ? t("fields.hideDetails") : t("fields.showDetails")}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Campos principais sempre visíveis - 1 linha em telas grandes */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("fields.status")}
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as CollectionStatus)}
                options={statusOptions}
                size="sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("fields.media")}
              </label>
              <Select
                value={media}
                onChange={(e) => setMedia(e.target.value as MediaType)}
                options={mediaOptions}
                size="sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("fields.condition")}
              </label>
              <Select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                options={conditionOptions}
                size="sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("fields.progress")}
              </label>
              <Input
                type="number"
                value={progress}
                onChange={(e) => setProgress(e.target.value ? Number(e.target.value) : "")}
                min={0}
                max={10}
                step={0.1}
                inputSize="sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("fields.rating")}
              </label>
              <Input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")}
                min={0}
                max={10}
                step={0.1}
                inputSize="sm"
              />
            </div>
          </div>

          {/* Campos secundários em collapse */}
          <details className="border border-gray-200 dark:border-gray-700 rounded p-2">
            <summary className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              Campos Adicionais
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("fields.price")}
                  {status === "SELLING" && <span className="text-red-500 ml-1">*</span>}
                </label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value ? Number(e.target.value) : "");
                    setPriceError("");
                  }}
                  min={0}
                  step={0.01}
                  inputSize="sm"
                  error={priceError}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={hasBox}
                    onChange={(e) => setHasBox(e.target.checked)}
                    className="rounded"
                  />
                  {t("fields.hasBox")}
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={hasManual}
                    onChange={(e) => setHasManual(e.target.checked)}
                    className="rounded"
                  />
                  {t("fields.hasManual")}
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={acceptsTrade}
                    onChange={(e) => setAcceptsTrade(e.target.checked)}
                    className="rounded"
                  />
                  {t("fields.acceptsTrade")}
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("fields.description")}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </details>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={isSaving}
            label={isSaving ? t("fields.saving") : t("fields.saveChanges")}
          />
        </div>
      )}
    </div>
  );
}
