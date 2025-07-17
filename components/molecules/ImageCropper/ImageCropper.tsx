// components/ui/ImageCropper.tsx
"use client";

import { Button } from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  src: string;
  aspect?: number;
  onBlobReady: (blob: Blob) => void;
  setFileSrc?: (src: string | null) => void;
  onCancel?: () => void;
  onCropChange?: (crop: Crop) => void;
}

export default function ImageCropper({
  src,
  aspect = 1,
  onBlobReady,
  setFileSrc,
  onCancel,
  onCropChange,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations("");

  const handleCropChange = useCallback(
    (newCrop: Crop) => {
      setCrop(newCrop);
      if (onCropChange) {
        onCropChange(newCrop);
      }
    },
    [onCropChange],
  );

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const initialCrop = centerCrop(
        makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
        width,
        height,
      );
      setCrop(initialCrop);
      setIsLoaded(true);
    },
    [aspect],
  );

  const handleCancel = useCallback(() => {
    setFileSrc?.(null);
    onCancel?.();
  }, [onCancel, setFileSrc]);

  const onCropComplete = useCallback((completed: PixelCrop) => {
    setPixelCrop(completed);
  }, []);

  const onConfirm = useCallback(() => {
    if (imgRef.current && pixelCrop && isLoaded) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        try {
          ctx.drawImage(
            imgRef.current,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
          );

          canvas.toBlob(
            (blob) => {
              if (blob) {
                onBlobReady(blob);
              }
            },
            "image/jpeg",
            0.9,
          );
        } catch (error) {
          console.error("Error processing image:", error);
          // Fallback para imagens problemáticas
          onBlobReady(new Blob());
        }
      }
    }
  }, [onBlobReady, pixelCrop, isLoaded]);

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleCancel]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="flex-1 flex items-center justify-center w-full overflow-auto">
        <ReactCrop
          crop={crop}
          onChange={handleCropChange}
          onComplete={onCropComplete}
          aspect={aspect}
          className="max-w-full max-h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            alt="Crop preview"
            src={src}
            crossOrigin="anonymous" // Adicionar isso para imagens de origem cruzada
            onLoad={onImageLoad}
            className="max-w-full max-h-[70vh] object-contain"
            onError={(e) => {
              console.error("Error loading image", e);
              handleCancel();
            }}
          />
        </ReactCrop>
      </div>

      <div className="mt-4 gap-3 flex justify-end w-full max-w-3xl px-4 py-3 bg-white dark:bg-gray-900 rounded-lg">
        <Button
          variant="transparent"
          status="danger"
          onClick={handleCancel}
          label={t("crop.cancelCrop")}
        />
        <Button
          onClick={onConfirm}
          label={t("crop.confirmCrop")}
          data-testid="button-crop-confirm"
          disabled={!isLoaded} // Desabilitar enquanto a imagem não carregar
        />
      </div>
    </div>
  );
}
