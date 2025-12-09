import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";

import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";

interface CreatedVariant {
  id: number;
  slug: string;
  name: string;
  consoleId: number;
}

interface CreateConsoleVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (variant: CreatedVariant) => void;
  consoleId: number;
  consoleName: string;
}

export const CreateConsoleVariantModal: React.FC<CreateConsoleVariantModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  consoleId,
  consoleName,
}) => {
  const t = useTranslations("CreateConsoleVariantModal");
  const { token } = useAuth();

  // Variant fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [allDigital, setAllDigital] = useState(false);

  // Skin fields
  const [skinName, setSkinName] = useState("");
  const [skinDescription, setSkinDescription] = useState("");
  const [skinReleaseDate, setSkinReleaseDate] = useState("");
  const [skinLimitedEdition, setSkinLimitedEdition] = useState(false);
  const [skinEditionName, setSkinEditionName] = useState("");
  const [skinMaterial, setSkinMaterial] = useState("");
  const [skinFinish, setSkinFinish] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !skinName.trim()) {
      setError(t("requiredFields"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiFetch<{ variant: CreatedVariant }>("/consoles/variants", {
        method: "POST",
        body: {
          consoleId,
          name,
          description: description || undefined,
          releaseDate: releaseDate || undefined,
          allDigital,

          skinName,
          skinDescription: skinDescription || undefined,
          skinReleaseDate: skinReleaseDate || undefined,
          skinLimitedEdition,
          skinEditionName: skinEditionName || undefined,
          skinMaterial: skinMaterial || undefined,
          skinFinish: skinFinish || undefined,
        },
        token,
      });
      onSuccess(response.variant);
      onClose();
    } catch (err) {
      console.error(err);
      setError(t("errorCreating"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={t("title")}
      actionButtons={{
        confirm: {
          label: t("create"),
          type: "submit",
          form: "create-console-variant-form",
          loading: isLoading,
        },
        cancel: {
          label: t("cancel"),
          onClick: onClose,
          disabled: isLoading,
        },
      }}
    >
      <form id="create-console-variant-form" onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("description")}</p>

        <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("consoleLabel")}:{" "}
            <span className="font-medium text-gray-900 dark:text-white">{consoleName}</span>
          </p>
        </div>

        {/* Variant Fields */}
        <div className="space-y-4 border-b pb-4">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white">
            {t("variantSection")}
          </h4>

          <Input
            label={t("nameLabel")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            required
          />

          <Textarea
            label={t("descriptionLabel")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            rows={2}
          />

          <Input
            label={t("releaseDateLabel")}
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />

          <Checkbox
            label={t("allDigitalLabel")}
            checked={allDigital}
            onChange={(e) => setAllDigital(e.target.checked)}
          />
        </div>

        {/* Skin Fields */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white">{t("skinSection")}</h4>

          <Input
            label={t("skinNameLabel")}
            value={skinName}
            onChange={(e) => setSkinName(e.target.value)}
            placeholder={t("skinNamePlaceholder")}
            required
          />

          <Textarea
            label={t("skinDescriptionLabel")}
            value={skinDescription}
            onChange={(e) => setSkinDescription(e.target.value)}
            placeholder={t("skinDescriptionPlaceholder")}
            rows={2}
          />

          <Input
            label={t("skinReleaseDateLabel")}
            type="date"
            value={skinReleaseDate}
            onChange={(e) => setSkinReleaseDate(e.target.value)}
          />

          <Checkbox
            label={t("skinLimitedEditionLabel")}
            checked={skinLimitedEdition}
            onChange={(e) => setSkinLimitedEdition(e.target.checked)}
          />

          {skinLimitedEdition && (
            <Input
              label={t("skinEditionNameLabel")}
              value={skinEditionName}
              onChange={(e) => setSkinEditionName(e.target.value)}
              placeholder={t("skinEditionNamePlaceholder")}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("skinMaterialLabel")}
              value={skinMaterial}
              onChange={(e) => setSkinMaterial(e.target.value)}
              placeholder={t("skinMaterialPlaceholder")}
            />
            <Input
              label={t("skinFinishLabel")}
              value={skinFinish}
              onChange={(e) => setSkinFinish(e.target.value)}
              placeholder={t("skinFinishPlaceholder")}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>
    </Dialog>
  );
};
