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
import { ChevronDown, ChevronUp, Plus, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";

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

  // Estados para imagens
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

  // Estado formData agora só contém campos editáveis
  const [formData, setFormData] = useState({
    description: "",
    status: initialStatus === "TRADE" ? "SELLING" : "OWNED",
    price: "",
    hasBox: false,
    hasManual: false,
    condition: "USED" as "NEW" | "USED" | "REFURBISHED",
    acceptsTrade: false,
  });

  // Função para enviar imagens para o Cloudinary
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
        throw new Error(errorData.message || "Falha no upload da imagem");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Erro no upload:", error);
      throw new Error("Erro ao processar imagem");
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, type: "main" | "additional") => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Para a foto principal, pegamos apenas a primeira
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
      // Para fotos adicionais, processamos múltiplas
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setCurrentCropImage({
            url,
            type: "additional",
            index: additionalPhotos.length,
          });
          setIsCropOpen(true);
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = "";
  };

  const handleCropComplete = (blob: Blob) => {
    if (!currentCropImage) return;

    const url = URL.createObjectURL(blob);
    if (currentCropImage.type === "main") {
      setPhotoMain({ url, blob });
    } else {
      setAdditionalPhotos((prev) => [...prev, { url, blob }]);
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
      // Upload da foto principal
      let mainPhotoUrl = "";
      if (photoMain?.blob) {
        mainPhotoUrl = await uploadToCloudinary(photoMain.blob, "main");
      }

      // Upload das fotos adicionais
      const additionalUrls: string[] = [];
      for (const photo of additionalPhotos) {
        if (photo.blob) {
          const url = await uploadToCloudinary(photo.blob);
          additionalUrls.push(url);
        }
      }

      // Preparar payload com URLs das imagens
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
        setError("Ocorreu um erro ao adicionar à coleção");
        showToast("Ocorreu um erro ao adicionar à coleção", "danger");
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
      {/* Exibição de erro geral */}
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

        <div className="space-y-4">
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
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          label={t("description")}
          placeholder={t("descriptionPlaceholder")}
          rows={4}
        />
      </div>

      {/* Collapse para Trade */}
      <div className="border rounded-lg overflow-hidden">
        <button
          type="button"
          className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setTradeSectionOpen(!tradeSectionOpen)}
        >
          <span className="font-medium">{t("tradeSection")}</span>
          {tradeSectionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {tradeSectionOpen && (
          <div className="p-4 border-t bg-white dark:bg-gray-900 space-y-6">
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
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
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

            <div>
              <label className="block text-sm font-medium mb-2">{t("mainPhoto")}</label>
              {photoMain ? (
                <div className="relative group w-24 h-24">
                  <Image
                    src={photoMain.url}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md border"
                    sizes="100px"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <Button
                      variant="transparent"
                      onClick={() => {
                        setCurrentCropImage({ url: photoMain.url, type: "main" });
                        setIsCropOpen(true);
                      }}
                      icon={<Edit size={16} className="text-white" />}
                    />
                    <Button
                      variant="transparent"
                      onClick={() => removeImage("main")}
                      icon={<Trash2 size={16} className="text-white" />}
                    />
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => mainFileInputRef.current?.click()}
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
                  <div key={index} className="relative group w-24 h-24">
                    <Image
                      src={photo.url}
                      alt="Preview"
                      fill
                      className="object-cover rounded-md border"
                      sizes="100px"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                      <Button
                        variant="transparent"
                        onClick={() => {
                          setCurrentCropImage({ url: photo.url, type: "additional", index });
                          setIsCropOpen(true);
                        }}
                        icon={<Edit size={16} className="text-white" />}
                      />
                      <Button
                        variant="transparent"
                        onClick={() => removeImage("additional", index)}
                        icon={<Trash2 size={16} className="text-white" />}
                      />
                    </div>
                  </div>
                ))}

                {additionalPhotos.length < 5 && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => additionalFileInputRef.current?.click()}
                    className="w-24 h-24 flex flex-col items-center justify-center"
                  >
                    <Plus size={24} />
                    <span className="mt-1 text-xs">{t("addPhoto")}</span>
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
        )}
      </div>

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

      <div className="flex justify-end gap-3 pt-4 border-t">
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
