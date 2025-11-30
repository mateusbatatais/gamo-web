import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { AccessoryVariantDetail } from "@/@types/catalog.types";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";

interface CreateAccessoryVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (variant: AccessoryVariantDetail) => void;
  accessoryId: number;
  accessoryName: string;
}

export const CreateAccessoryVariantModal: React.FC<CreateAccessoryVariantModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  accessoryId,
  accessoryName,
}) => {
  const t = useTranslations("CreateAccessoryVariantModal");
  const { token } = useAuth();

  // Variant fields
  const [variantName, setVariantName] = useState("");
  const [variantDescription, setVariantDescription] = useState("");
  const [variantReleaseDate, setVariantReleaseDate] = useState("");
  const [limitedEdition, setLimitedEdition] = useState(false);
  const [material, setMaterial] = useState("");
  const [finish, setFinish] = useState("");
  const [editionName, setEditionName] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!variantName.trim()) {
      setError(t("requiredFields"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiFetch<AccessoryVariantDetail>("/accessories/variants", {
        method: "POST",
        body: {
          accessoryId,
          name: variantName,
          description: variantDescription || undefined,
          releaseDate: variantReleaseDate || undefined,
          limitedEdition,
          material: material || undefined,
          finish: finish || undefined,
          editionName: editionName || undefined,
        },
        token,
      });
      onSuccess(response);
      onClose();
    } catch (err) {
      console.error(err);
      setError(t("errorCreating"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title={t("title")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("description")}</p>

        {/* Show selected accessory */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("accessoryLabel")}:{" "}
            <span className="font-medium text-gray-900 dark:text-white">{accessoryName}</span>
          </p>
        </div>

        {/* Variant Fields */}
        <div className="space-y-4">
          <Input
            label={t("variantNameLabel")}
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
            placeholder={t("variantNamePlaceholder")}
            required
          />

          <Textarea
            label={t("variantDescriptionLabel")}
            value={variantDescription}
            onChange={(e) => setVariantDescription(e.target.value)}
            placeholder={t("variantDescriptionPlaceholder")}
            rows={2}
          />

          <Input
            label={t("variantReleaseDateLabel")}
            type="date"
            value={variantReleaseDate}
            onChange={(e) => setVariantReleaseDate(e.target.value)}
          />

          <Checkbox
            label={t("limitedEditionLabel")}
            checked={limitedEdition}
            onChange={(e) => setLimitedEdition(e.target.checked)}
          />

          <Input
            label={t("materialLabel")}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder={t("materialPlaceholder")}
          />

          <Input
            label={t("finishLabel")}
            value={finish}
            onChange={(e) => setFinish(e.target.value)}
            placeholder={t("finishPlaceholder")}
          />

          <Input
            label={t("editionNameLabel")}
            value={editionName}
            onChange={(e) => setEditionName(e.target.value)}
            placeholder={t("editionNamePlaceholder")}
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose} label={t("cancel")} />
          <Button type="submit" loading={isLoading} label={t("create")} />
        </div>
      </form>
    </Dialog>
  );
};
