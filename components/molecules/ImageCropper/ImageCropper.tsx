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
}

export default function ImageCropper({
  src,
  aspect = 1,
  onBlobReady,
  setFileSrc,
  onCancel,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const t = useTranslations("");

  const [isOpen, setIsOpen] = useState(true);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      const initialCrop = centerCrop(
        makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
        width,
        height,
      );
      setCrop(initialCrop);
    },
    [aspect],
  );

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    setFileSrc?.(null);
    onCancel?.();
  }, [onCancel, setFileSrc]);

  const onCropComplete = useCallback((completed: PixelCrop) => {
    setPixelCrop(completed);
  }, []);

  const onConfirm = useCallback(() => {
    if (imgRef.current && pixelCrop) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
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
              setIsOpen(false);
            }
          },
          "image/jpeg",
          0.9,
        );
      }
    }
  }, [onBlobReady, pixelCrop]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="w-full h-full max-w-[90vw] max-h-[90vh] flex flex-col gap-4">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={onCropComplete}
            aspect={aspect}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              alt="Crop preview"
              src={src}
              onLoad={onImageLoad}
              crossOrigin="anonymous"
              style={{
                maxWidth: "100%",
                maxHeight: "calc(90vh - 100px)",
                width: "auto",
                height: "auto",
              }}
              data-testid="image-cropper"
            />
          </ReactCrop>
        </div>

        <div className="flex gap-3 justify-end px-4 py-3 bg-white dark:bg-gray-900 rounded-lg flex-shrink-0">
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
          />
        </div>
      </div>
    </div>
  );
}
