import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";

interface CreatedSkin {
  id: number;
  slug: string;
  name: string;
  variantId: number;
}

interface CreateSkinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (skin: CreatedSkin) => void;
  variantId: number;
  variantName: string;
}

export const CreateSkinModal: React.FC<CreateSkinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  variantId,
  variantName,
}) => {
  const t = useTranslations("CreateSkinModal");
  const { token } = useAuth();

  // Skin fields
  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [limitedEdition, setLimitedEdition] = useState(false);
  const [editionName, setEditionName] = useState("");
  const [material, setMaterial] = useState("");
  const [finish, setFinish] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t("requiredFields"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiFetch<CreatedSkin>(`/consoles/variants/${variantId}/skins`, {
        method: "POST",
        body: {
          variantId,
          name,
          releaseDate: releaseDate || undefined,
          limitedEdition,
          editionName: editionName || undefined,
          material: material || undefined,
          finish: finish || undefined,
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

        <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("variantLabel")}:{" "}
            <span className="font-medium text-gray-900 dark:text-white">{variantName}</span>
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label={t("nameLabel")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            required
          />

          <Input
            label={t("releaseDateLabel")}
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />

          <Checkbox
            label={t("limitedEditionLabel")}
            checked={limitedEdition}
            onChange={(e) => setLimitedEdition(e.target.checked)}
          />

          {limitedEdition && (
            <Input
              label={t("editionNameLabel")}
              value={editionName}
              onChange={(e) => setEditionName(e.target.value)}
              placeholder={t("editionNamePlaceholder")}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
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
          </div>
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
