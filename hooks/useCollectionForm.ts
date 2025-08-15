// src/hooks/useCollectionForm.ts
"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

interface ConsoleRes {
  url: string;
}

export const useCollectionForm = (initialPhotos: string[] = [], initialMainPhoto?: string) => {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();

  // Estados para as imagens (mantidos igual)
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

  const uploadMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      const formData = new FormData();
      formData.append("file", blob, `collection-${Date.now()}.jpg`);

      // Remova o headers: {} pois o apiFetch já cuida disso
      const response = await apiFetch<ConsoleRes>("/uploads/collection", {
        method: "POST",
        body: formData, // Isso será detectado como FormData
      });

      return response.url as string;
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao fazer upload da imagem", "danger");
    },
  });

  // Funções mantidas, mas usando a mutation
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
    e.target.value = "";
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

  const uploadImages = async () => {
    // Upload da foto principal
    let mainPhotoUrl = photoMain?.url || null;
    if (photoMain?.blob) {
      mainPhotoUrl = await uploadMutation.mutateAsync(photoMain.blob);
    }

    // Upload das fotos adicionais
    const additionalUrls: string[] = [];
    for (const photo of additionalPhotos) {
      if (photo.blob) {
        const url = await uploadMutation.mutateAsync(photo.blob);
        if (url) additionalUrls.push(url);
      } else {
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
    loading: uploadMutation.isPending,
    handleImageUpload,
    handleCropComplete,
    removeImage,
    uploadImages,
    setCurrentCropImage,
    setPhotoMain,
    setAdditionalPhotos,
  };
};
