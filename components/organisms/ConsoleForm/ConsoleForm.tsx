// components/organisms/ConsoleForm/ConsoleForm.tsx
"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Select } from "@/components/atoms/Select/Select";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { ImagePreview } from "@/components/molecules/ImagePreview/ImagePreview";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { apiFetch } from "@/utils/api";
import { Plus } from "lucide-react";
import { UserConsoleInput, UserConsoleUpdate } from "@/@types/userConsole";

interface ConsoleFormProps {
  mode: "create" | "edit";
  consoleId: number;
  consoleVariantId: number;
  skinId?: number | null;
  initialData?: {
    id?: number;
    description?: string | null;
    status?: "OWNED" | "SELLING" | "LOOKING_FOR";
    price?: number | null;
    hasBox?: boolean | null;
    hasManual?: boolean | null;
    condition?: "NEW" | "USED" | "REFURBISHED" | null;
    acceptsTrade?: boolean | null;
    photoMain?: string | null;
    photos?: string[] | null;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const ConsoleForm = ({
  mode,
  consoleId,
  consoleVariantId,
  skinId,
  initialData,
  onSuccess,
  onCancel,
}: ConsoleFormProps) => {
  const t = useTranslations("ConsoleForm");
  const { token } = useAuth();
  const { showToast } = useToast();

  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    description: initialData?.description || "",
    status: initialData?.status || "OWNED",
    price: initialData?.price ? String(initialData.price) : "",
    hasBox: initialData?.hasBox || false,
    hasManual: initialData?.hasManual || false,
    condition: initialData?.condition || "USED",
    acceptsTrade: initialData?.acceptsTrade || false,
  });

  // Estados para as imagens
  const [photoMain, setPhotoMain] = useState<{ url: string; blob: Blob | null } | null>(
    initialData?.photoMain ? { url: initialData.photoMain, blob: null } : null,
  );
  const [additionalPhotos, setAdditionalPhotos] = useState<{ url: string; blob: Blob | null }[]>(
    initialData?.photos ? initialData.photos.map((url) => ({ url, blob: null })) : [],
  );
  const [currentCropImage, setCurrentCropImage] = useState<{
    url: string;
    type: "main" | "additional";
    index?: number;
  } | null>(null);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "main" | "additional",
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (type === "main") {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCurrentCropImage({
          url,
          type: "main",
        });
      };
      reader.readAsDataURL(file);
    } else {
      const newPhotos: { url: string; blob: Blob | null }[] = [];
      for (const file of files.slice(0, 5 - additionalPhotos.length)) {
        const url = URL.createObjectURL(file);
        newPhotos.push({ url, blob: file });
      }
      setAdditionalPhotos((prev) => [...prev, ...newPhotos]);
    }
    e.target.value = ""; // Reset input
  };

  const handleCropComplete = (blob: Blob) => {
    if (!currentCropImage) return;

    const url = URL.createObjectURL(blob);

    if (currentCropImage.type === "main") {
      setPhotoMain({ url, blob });
    } else if (currentCropImage.index !== undefined) {
      setAdditionalPhotos((prev) =>
        prev.map((photo, index) => (index === currentCropImage.index ? { url, blob } : photo)),
      );
    }

    setCurrentCropImage(null);
  };

  const removeImage = (type: "main" | "additional", index?: number) => {
    if (type === "main") {
      setPhotoMain(null);
    } else if (index !== undefined) {
      setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const uploadToCloudinary = async (blob: Blob, type: "main" | "additional" = "additional") => {
    try {
      const formData = new FormData();
      formData.append("file", blob, `${type}-${Date.now()}.jpg`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads/collection`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      showToast(
        (error instanceof Error ? error.message : String(error)) || t("uploadError"),
        "danger",
      );
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload da foto principal (se houver blob novo)
      let mainPhotoUrl = photoMain?.url || null;
      if (photoMain?.blob) {
        mainPhotoUrl = await uploadToCloudinary(photoMain.blob, "main");
      }

      // Upload das fotos adicionais
      const additionalUrls: string[] = [];
      for (const photo of additionalPhotos) {
        if (photo.blob) {
          const url = await uploadToCloudinary(photo.blob);
          if (url) additionalUrls.push(url);
        } else {
          // Se não tem blob, é porque já está salva (URL existente)
          additionalUrls.push(photo.url);
        }
      }

      // Preparar payload baseado no modo
      const payload: UserConsoleInput | UserConsoleUpdate = {
        consoleId,
        consoleVariantId,
        skinId: skinId || undefined,
        description: formData.description || undefined,
        status: formData.status,
        price: formData.price ? parseFloat(formData.price) : undefined,
        hasBox: formData.hasBox,
        hasManual: formData.hasManual,
        condition: formData.condition,
        acceptsTrade: formData.acceptsTrade,
        photoMain: mainPhotoUrl || undefined,
        photos: additionalUrls,
      };

      // Fazer chamada API baseada no modo
      if (mode === "create") {
        await apiFetch("/user-consoles", {
          method: "POST",
          token,
          body: payload,
        });
      } else if (mode === "edit" && initialData?.id) {
        await apiFetch(`/user-consoles/${initialData.id}`, {
          method: "PUT",
          token,
          body: payload,
        });
      }

      onSuccess();
      showToast(mode === "create" ? t("createSuccess") : t("editSuccess"), "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("error"), "danger");
    } finally {
      setLoading(false);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t("mainPhoto")}</label>
          {photoMain ? (
            <ImagePreview
              src={photoMain.url}
              onRemove={() => removeImage("main")}
              onCropComplete={(blob) => {
                const url = URL.createObjectURL(blob);
                setPhotoMain({ url, blob });
              }}
              initialProcessed={true}
            />
          ) : (
            <Button
              variant="outline"
              type="button"
              onClick={() => mainFileInputRef.current?.click()}
              className="w-32 h-32 flex flex-col items-center justify-center"
              icon={<Plus size={16} />}
              label={t("addMainPhoto")}
            />
          )}
          <input
            type="file"
            ref={mainFileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "main")}
          />
        </div>

        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          label={t("description")}
          placeholder={t("descriptionPlaceholder")}
          rows={4}
        />
      </div>

      <Collapse title={t("tradeSection")} defaultOpen={formData.status !== "OWNED"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label={t("status")}
              options={statusOptions}
            />

            <Select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              label={t("condition")}
              options={conditionOptions}
            />

            <Input
              name="price"
              value={formData.price}
              onChange={handleChange}
              label={t("price")}
              placeholder={t("pricePlaceholder")}
              type="number"
              min="0"
              step="0.01"
            />
          </div>

          <Checkbox
            name="acceptsTrade"
            checked={formData.acceptsTrade}
            onChange={handleChange}
            label={t("acceptsTrade")}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t("extras")}</label>
            <div className="flex gap-4">
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
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("additionalPhotos")} ({additionalPhotos.length}/5)
            </label>
            <div className="flex flex-wrap gap-3">
              {additionalPhotos.map((photo, index) => (
                <ImagePreview
                  key={index}
                  src={photo.url}
                  onRemove={() => removeImage("additional", index)}
                  onCropComplete={(blob) => {
                    const url = URL.createObjectURL(blob);
                    const newPhotos = [...additionalPhotos];
                    newPhotos[index] = { url, blob };
                    setAdditionalPhotos(newPhotos);
                  }}
                  initialProcessed={!photo.blob}
                />
              ))}

              {additionalPhotos.length < 5 && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => additionalFileInputRef.current?.click()}
                  className="w-24 h-24 flex flex-col items-center justify-center"
                  icon={<Plus size={16} />}
                >
                  {t("addPhoto")}
                </Button>
              )}
            </div>
            <input
              type="file"
              ref={additionalFileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, "additional")}
            />
          </div>
        </div>
      </Collapse>

      {currentCropImage && (
        <ImageCropper
          src={currentCropImage.url}
          onBlobReady={handleCropComplete}
          onCancel={() => setCurrentCropImage(null)}
        />
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} label={t("cancel")} />
        <Button
          type="submit"
          loading={loading}
          label={
            loading ? t("saving") : mode === "create" ? t("addToCollection") : t("saveChanges")
          }
        />
      </div>
    </form>
  );
};
