// src/components/molecules/SimpleGameForm/SimpleGameForm.tsx
"use client";

import React, { ChangeEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Select, SelectOption } from "@/components/atoms/Select/Select";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Range } from "@/components/atoms/Range/Range";
import { Rating } from "@/components/atoms/Rating/Rating";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";
import { MediaType, UserGame } from "@/@types/collection.types";
import { ConsoleSelector } from "@/components/molecules/ConsoleSelector/ConsoleSelector";

interface SimpleGameFormProps {
  gameId: number;
  gameSlug: string;
  platformOptions: SelectOption[];
  onSuccess: () => void;
  onCancel: () => void;
  formId?: string;
  hideButtons?: boolean;
}

interface SimpleFormState {
  media: MediaType;
  progress: string;
  rating: number;
  review: string;
  abandoned: boolean;
  platformId: number;
}

export const SimpleGameForm = ({
  gameId,
  gameSlug,
  platformOptions,
  onSuccess,
  onCancel,
  formId,
  hideButtons = false,
}: SimpleGameFormProps) => {
  const t = useTranslations("TradeForm");
  const { createUserGame, isPending } = useUserGameMutation();

  const [formData, setFormData] = useState<SimpleFormState>({
    media: "PHYSICAL",
    progress: "0",
    rating: 0,
    review: "",
    abandoned: false,
    platformId: Number(platformOptions[0]?.value) || 0,
  });

  const [selectedConsoleIds, setSelectedConsoleIds] = useState<number[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (type === "checkbox") {
        return { ...prev, [name]: (e.target as HTMLInputElement).checked } as SimpleFormState;
      }
      if (name === "platformId") {
        return { ...prev, platformId: Number(value) };
      }
      if (name === "media") {
        return { ...prev, media: value as MediaType };
      }
      return { ...prev, [name]: value } as SimpleFormState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UserGame = {
      gameId,
      media: formData.media,
      status: "OWNED",
      abandoned: formData.abandoned,
      platformId: formData.platformId,
      ...(formData.progress ? { progress: parseFloat(formData.progress) } : {}),
      ...(formData.rating ? { rating: formData.rating } : {}),
      ...(formData.review ? { review: formData.review } : {}),
      compatibleUserConsoleIds: selectedConsoleIds.length > 0 ? selectedConsoleIds : undefined,
    };

    await createUserGame(payload);
    onSuccess();
  };

  const mediaOptions: { value: MediaType; label: string }[] = [
    { value: "PHYSICAL", label: t("mediaPhysical") },
    { value: "DIGITAL", label: t("mediaDigital") },
  ];

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          name="platformId"
          value={String(formData.platformId)}
          onChange={handleChange}
          label={t("platform")}
          options={platformOptions}
        />
        <Select
          name="media"
          value={formData.media}
          onChange={handleChange}
          label={t("media")}
          options={mediaOptions}
        />
      </div>

      <ConsoleSelector
        gameSlug={gameSlug}
        platformId={formData.platformId}
        selectedConsoleIds={selectedConsoleIds}
        onChange={setSelectedConsoleIds}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Range
          label={t("progress")}
          value={Number(formData.progress)}
          onChange={(newValue) => setFormData((prev) => ({ ...prev, progress: String(newValue) }))}
          min={0}
          max={10}
          step={0.5}
        />

        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
            {t("rating")}
          </span>
          <Rating
            value={formData.rating}
            onChange={(newValue) => setFormData((prev) => ({ ...prev, rating: newValue }))}
            size="lg"
          />
        </div>
      </div>

      <Textarea
        name="review"
        value={formData.review}
        onChange={handleChange}
        label={t("review")}
        placeholder={t("reviewPlaceholder")}
        rows={3}
      />

      <Checkbox
        name="abandoned"
        checked={formData.abandoned}
        onChange={handleChange}
        label={t("abandoned")}
      />

      {!hideButtons && (
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} label={t("cancel")} />
          <Button
            type="submit"
            loading={isPending}
            label={isPending ? t("saving") : t("addToCollection")}
          />
        </div>
      )}
    </form>
  );
};
