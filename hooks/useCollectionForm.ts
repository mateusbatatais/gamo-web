// hooks/useCollectionForm.ts
"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

export const useCollectionForm = (initialPhotos: string[] = [], initialMainPhoto?: string) => {
  const { token } = useAuth();
  const { showToast } = useToast();

  // Estados para as imagens
  const [photoMain, setPhotoMain] = useState<{ url: string; blob: Blob | null } | null>(
    initialMainPhoto ? { url: initialMainPhoto, blob: null } : null,
  );
  const [additionalPhotos, setAdditionalPhotos] = useState<{ url: string; blob: Blob | null }[]>(
    initialPhotos.map((url) => ({ url, blob: null })),
  );
  const [currentCropImage, setCurrentCropImage] = useState<{
    url: string;
    type: "main" | "additional";
    index?: number;
  } | null>(null);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

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
        (error instanceof Error ? error.message : String(error)) || "Error uploading image",
        "danger",
      );
      return null;
    }
  };

  const uploadImages = async () => {
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

    return { mainPhotoUrl, additionalUrls };
  };

  return {
    photoMain,
    additionalPhotos,
    currentCropImage,
    mainFileInputRef,
    additionalFileInputRef,
    loading,
    setLoading,
    handleImageUpload,
    handleCropComplete,
    removeImage,
    uploadImages,
    setCurrentCropImage,
    setPhotoMain,
    setAdditionalPhotos,
  };
};
