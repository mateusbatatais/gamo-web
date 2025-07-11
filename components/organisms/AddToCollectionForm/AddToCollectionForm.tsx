// components/organisms/AddToCollectionForm/AddToCollectionForm.tsx
"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { apiFetch } from "@/utils/api";
import { useTranslations } from "next-intl";
import { Select } from "@/components/atoms/Select/Select";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Plus } from "lucide-react";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import { ImagePreview } from "@/components/molecules/ImagePreview/ImagePreview";

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
  const [tradeSectionOpen, setTradeSectionOpen] = useState(initialStatus === "TRADE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const [photoMain, setPhotoMain] = useState<{ url: string; blob: Blob | null } | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<{ url: string; blob: Blob | null }[]>(
    [],
  );
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState<{
    url: string;
    type: "main" | "additional";
    index?: number;
  } | null>(null);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    description: "",
    status: initialStatus === "TRADE" ? "SELLING" : "OWNED",
    price: "",
    hasBox: false,
    hasManual: false,
    condition: "USED" as "NEW" | "USED" | "REFURBISHED",
    acceptsTrade: false,
  });

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
      showToast((error instanceof Error ? error.message : String(error)) || "error", "danger");
    }
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
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      // Fluxo para múltiplas imagens (sem crop inicial)
      const newPhotos: { url: string; blob: Blob | null }[] = [];

      for (const file of files) {
        try {
          const url = URL.createObjectURL(file);
          newPhotos.push({ url, blob: file });
        } catch (error) {
          console.error("Erro ao processar imagem:", error);
        }
      }

      setAdditionalPhotos((prev) => [
        ...prev,
        ...newPhotos.slice(0, 5 - prev.length), // Limite de 5 fotos
      ]);
    }

    e.target.value = ""; // Resetar o input
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

    setIsCropOpen(false);
    setCurrentCropImage(null);
  };

  const removeImage = (type: "main" | "additional", index?: number) => {
    if (type === "main") {
      setPhotoMain(null);
    } else if (index !== undefined) {
      setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let mainPhotoUrl = "";
      if (photoMain?.blob) {
        mainPhotoUrl = await uploadToCloudinary(photoMain.blob, "main");
      }

      const additionalUrls: string[] = [];
      for (const photo of additionalPhotos) {
        if (photo.blob) {
          const url = await uploadToCloudinary(photo.blob);
          additionalUrls.push(url);
        }
      }

      const payload = {
        ...formData,
        consoleVariantId,
        skinId,
        consoleId,
        price: formData.price ? parseFloat(formData.price) : undefined,
        photoMain: mainPhotoUrl,
        photos: additionalUrls,
      };

      await apiFetch("/user-consoles", {
        method: "POST",
        token,
        body: payload,
      });

      onSuccess();
      showToast(t("success"), "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        showToast(err.message, "danger");
      } else {
        setError(t("error"));
        showToast(t("error"), "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      {error && <div className="text-red-500 text-center p-2">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            label={t("condition")}
            options={conditionOptions}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2" id="extras-label">
            {t("extras")}
          </label>
          <Checkbox
            name="hasBox"
            checked={formData.hasBox}
            onChange={handleChange}
            label={t("hasBox")}
            aria-labelledby="extras-label"
          />
          <Checkbox
            name="hasManual"
            checked={formData.hasManual}
            onChange={handleChange}
            label={t("hasManual")}
            aria-labelledby="extras-label"
          />
        </div>
      </div>

      <div>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          label={t("description")}
          placeholder={t("descriptionPlaceholder")}
          rows={4}
        />
      </div>

      <Collapse
        title={t("tradeSection")}
        defaultOpen={tradeSectionOpen}
        onToggle={() => setTradeSectionOpen(!tradeSectionOpen)}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label={t("status")}
              options={statusOptions}
            />

            <Input
              label={t("price")}
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder={t("price")}
            />
          </div>

          <Checkbox
            name="acceptsTrade"
            checked={formData.acceptsTrade}
            onChange={handleChange}
            label={t("acceptsTrade")}
          />

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
              />
            ) : (
              <Button
                variant="outline"
                type="button"
                onClick={() => mainFileInputRef.current?.click()}
                className="w-24 h-24 flex flex-col items-center justify-center"
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
                    const newPhotos = [...additionalPhotos];
                    const url = URL.createObjectURL(blob);
                    newPhotos[index] = { url, blob };
                    setAdditionalPhotos(newPhotos);
                  }}
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
              multiple // Aceita múltiplos arquivos
              onChange={(e) => handleImageUpload(e, "additional")}
            />
          </div>
        </div>
      </Collapse>

      {isCropOpen && currentCropImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4">
              <ImageCropper
                src={currentCropImage.url}
                onBlobReady={handleCropComplete}
                setFileSrc={() => {}}
                onCancel={() => {
                  setIsCropOpen(false);
                  setCurrentCropImage(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end ">
        <Button
          type="button"
          variant="transparent"
          status="warning"
          onClick={onSuccess}
          label={t("cancel")}
        />
        <Button type="submit" loading={loading} label={loading ? t("adding") : t("add")} />
      </div>
    </form>
  );
}
