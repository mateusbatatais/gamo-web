import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";

import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Accessory } from "@/@types/catalog.types";
import { Select } from "@/components/atoms/Select/Select";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { MultiSelect } from "@/components/atoms/MultiSelect/MultiSelect";

interface CreateAccessoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (accessory: Accessory) => void;
  initialName?: string;
}

interface AccessoryType {
  id: number;
  slug: string;
  name: string;
}

interface AccessorySubType {
  id: number;
  slug: string;
  name: string;
}

interface ConsoleOption {
  id: number;
  slug: string;
  name: string;
  brand: {
    id: number;
    slug: string;
    name: string;
  };
}

export const CreateAccessoryModal: React.FC<CreateAccessoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialName = "",
}) => {
  const t = useTranslations("CreateAccessoryModal");
  const { token } = useAuth();

  // Accessory fields
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [typeId, setTypeId] = useState<number | null>(null);
  const [subTypeId, setSubTypeId] = useState<number | null>(null);
  const [selectedConsoleIds, setSelectedConsoleIds] = useState<number[]>([]);

  // Variant fields
  const [variantName, setVariantName] = useState("");
  const [variantDescription, setVariantDescription] = useState("");
  const [variantReleaseDate, setVariantReleaseDate] = useState("");
  const [limitedEdition, setLimitedEdition] = useState(false);
  const [material, setMaterial] = useState("");
  const [finish, setFinish] = useState("");
  const [editionName, setEditionName] = useState("");

  // Data
  const [types, setTypes] = useState<AccessoryType[]>([]);
  const [subTypes, setSubTypes] = useState<AccessorySubType[]>([]);
  const [consoles, setConsoles] = useState<ConsoleOption[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isLoadingSubTypes, setIsLoadingSubTypes] = useState(false);
  const [isLoadingConsoles, setIsLoadingConsoles] = useState(false);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync name with initialName
  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  // Load accessory types and consoles
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingTypes(true);
      setIsLoadingConsoles(true);
      try {
        const [typesResponse, consolesResponse] = await Promise.all([
          apiFetch<AccessoryType[]>("/accessories/types", { token }),
          apiFetch<ConsoleOption[]>("/consoles/for-filter", { token }),
        ]);
        setTypes(typesResponse);
        setConsoles(consolesResponse);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoadingTypes(false);
        setIsLoadingConsoles(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen, token]);

  // Load subtypes when type changes
  useEffect(() => {
    const loadSubTypes = async () => {
      if (!typeId) {
        setSubTypes([]);
        return;
      }

      setIsLoadingSubTypes(true);
      try {
        const selectedType = types.find((t) => t.id === typeId);
        if (selectedType) {
          const response = await apiFetch<AccessorySubType[]>(
            `/accessories/subtypes?type=${selectedType.slug}`,
            { token },
          );
          setSubTypes(response);
          // Reset subtype if the new type doesn't have the currently selected subtype
          setSubTypeId(null);
        }
      } catch (err) {
        console.error("Error loading subtypes:", err);
      } finally {
        setIsLoadingSubTypes(false);
      }
    };

    loadSubTypes();
  }, [typeId, types, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    // Subtype is only required if there are subtypes available for the selected type
    const isSubTypeRequired = subTypes.length > 0;
    if (!name.trim() || !typeId || (isSubTypeRequired && !subTypeId) || !variantName.trim()) {
      setError(t("requiredFields"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiFetch<Accessory>("/accessories", {
        method: "POST",
        body: {
          name,
          typeId,
          subTypeId: subTypeId || undefined,
          consoleIds: selectedConsoleIds,
          description: description || undefined,
          releaseDate: releaseDate || undefined,
          variantName,
          variantDescription: variantDescription || undefined,
          variantReleaseDate: variantReleaseDate || undefined,
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
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={t("title")}
      actionButtons={{
        confirm: {
          label: t("create"),
          type: "submit",
          form: "create-accessory-form",
          loading: isLoading,
        },
        cancel: {
          label: t("cancel"),
          onClick: onClose,
          disabled: isLoading,
        },
      }}
    >
      <form id="create-accessory-form" onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("descriptionAccessory")}</p>

        {/* Accessory Fields */}
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
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t("typeLabel")}
            options={types.map((type) => ({ value: String(type.id), label: type.name }))}
            value={typeId ? String(typeId) : ""}
            onChange={(e) => {
              setTypeId(Number(e.target.value) || null);
            }}
            required
            disabled={isLoadingTypes}
          />

          {subTypes.length > 0 && (
            <Select
              label={t("subTypeLabel")}
              options={subTypes.map((subType) => ({
                value: String(subType.id),
                label: subType.name,
              }))}
              value={subTypeId ? String(subTypeId) : ""}
              onChange={(e) => setSubTypeId(Number(e.target.value) || null)}
              required
              disabled={!typeId || isLoadingSubTypes}
            />
          )}
        </div>

        <MultiSelect
          label={t("consolesLabel")}
          items={consoles.map((c) => ({
            id: c.id,
            name: `${c.name} (${c.brand.name})`,
          }))}
          selectedIds={selectedConsoleIds}
          onChange={setSelectedConsoleIds}
          placeholder={t("consolesPlaceholder")}
          disabled={isLoadingConsoles}
        />

        <Input
          label={t("releaseDateLabel")}
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />

        {/* Variant Fields */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-white">
            {t("variantSection")}
          </h4>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <Input
              label={t("editionNameLabel")}
              value={editionName}
              onChange={(e) => setEditionName(e.target.value)}
              placeholder={t("editionNamePlaceholder")}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>
    </Dialog>
  );
};
