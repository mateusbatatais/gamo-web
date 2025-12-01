import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Select } from "@/components/atoms/Select/Select";

interface CreatedData {
  console: CreatedConsole;
  variant: CreatedVariant;
  skin: CreatedSkin;
}

interface CreateConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: CreatedData) => void;
  initialName?: string;
}

interface Brand {
  id: number;
  slug: string;
  name: string;
}

interface CreatedConsole {
  id: number;
  slug: string;
  name: string;
  brandId: number;
}

interface CreatedVariant {
  id: number;
  slug: string;
  name: string;
  consoleId: number;
}

interface CreatedSkin {
  id: number;
  slug: string;
  name: string;
  variantId: number;
  imageUrl?: string | null;
}

export const CreateConsoleModal: React.FC<CreateConsoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialName = "",
}) => {
  const t = useTranslations("CreateConsoleModal");
  const { token } = useAuth();

  // Console fields
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [brandId, setBrandId] = useState<number | null>(null);
  const [generation, setGeneration] = useState<number | "">("");

  // Variant fields
  const [variantName, setVariantName] = useState("");
  const [variantDescription, setVariantDescription] = useState("");
  const [variantReleaseDate, setVariantReleaseDate] = useState("");
  const [variantAllDigital, setVariantAllDigital] = useState(false);

  // Skin fields
  const [skinName, setSkinName] = useState("");
  const [skinDescription, setSkinDescription] = useState("");
  const [skinReleaseDate, setSkinReleaseDate] = useState("");
  const [skinLimitedEdition, setSkinLimitedEdition] = useState(false);
  const [skinEditionName, setSkinEditionName] = useState("");
  const [skinMaterial, setSkinMaterial] = useState("");
  const [skinFinish, setSkinFinish] = useState("");

  // Data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync name with initialName
  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  // Load brands
  useEffect(() => {
    const loadBrands = async () => {
      setIsLoadingBrands(true);
      try {
        const response = await apiFetch<Brand[]>("/brands", { token });
        setBrands(response);
      } catch (err) {
        console.error("Error loading brands:", err);
      } finally {
        setIsLoadingBrands(false);
      }
    };

    if (isOpen) {
      loadBrands();
    }
  }, [isOpen, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !brandId || !variantName.trim() || !skinName.trim()) {
      setError(t("requiredFields"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiFetch<CreatedData>("/consoles", {
        method: "POST",
        body: {
          brandId,
          name,
          description: description || undefined,
          releaseDate: releaseDate || undefined,
          generation: generation ? Number(generation) : undefined,

          variantName,
          variantDescription: variantDescription || undefined,
          variantReleaseDate: variantReleaseDate || undefined,
          variantAllDigital,

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
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("descriptionConsole")}</p>

        {/* Console Fields */}
        <div className="space-y-4 border-b pb-4">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white">
            {t("consoleSection")}
          </h4>

          <Select
            label={t("brandLabel")}
            options={brands.map((brand) => ({
              value: String(brand.id),
              label: brand.slug.charAt(0).toUpperCase() + brand.slug.slice(1),
            }))}
            value={brandId ? String(brandId) : ""}
            onChange={(e) => setBrandId(Number(e.target.value) || null)}
            required
            disabled={isLoadingBrands}
          />

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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("releaseDateLabel")}
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
            <Input
              label={t("generationLabel")}
              type="number"
              value={generation}
              onChange={(e) => setGeneration(e.target.value ? Number(e.target.value) : "")}
              placeholder={t("generationPlaceholder")}
            />
          </div>
        </div>

        {/* Variant Fields */}
        <div className="space-y-4 border-b pb-4">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white">
            {t("variantSection")}
          </h4>

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
            label={t("variantAllDigitalLabel")}
            checked={variantAllDigital}
            onChange={(e) => setVariantAllDigital(e.target.checked)}
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

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose} label={t("cancel")} />
          <Button type="submit" loading={isLoading} label={t("create")} />
        </div>
      </form>
    </Dialog>
  );
};
