// components/Account/ProfileImageEditor.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ImageCropper from "@/components/ui/ImageCropper/ImageCropper";
import ImageUploader from "@/components/ui/ImageUploader/ImageUploader";
import Image from "next/image";
import { Input } from "@/components/ui/Input/Input";

export default function ProfileImageEditor() {
  const { user } = useAuth();
  const [step, setStep] = useState<"select" | "crop" | "preview" | "upload" | "done">("select");
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(user?.profileImage || null);

  // Gera a URL de preview quando o blob for definido
  useEffect(() => {
    if (croppedBlob) {
      const url = URL.createObjectURL(croppedBlob);
      setPreviewUrl(url);
      setStep("preview");
      return () => URL.revokeObjectURL(url);
    }
  }, [croppedBlob]);

  return (
    <div className="space-y-4">
      {/* 1. Seleção do arquivo */}
      {step === "select" && (
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFileSrc(URL.createObjectURL(file));
              setStep("crop");
            }
          }}
        />
      )}

      {/* 2. Crop */}
      {step === "crop" && fileSrc && (
        <ImageCropper
          src={fileSrc}
          aspect={1}
          onBlobReady={(blob) => {
            setCroppedBlob(blob);
          }}
        />
      )}

      {/* 3. Preview do crop */}
      {step === "preview" && previewUrl && (
        <div className="flex flex-col items-center gap-4">
          <p>Veja como ficou o corte:</p>
          <Image
            src={previewUrl}
            alt="Preview do Crop"
            width={128}
            height={128}
            className="rounded-full"
          />
          <button
            onClick={() => setStep("upload")}
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
          >
            Confirmar e Enviar
          </button>
          <button
            onClick={() => {
              // Volta para recortar
              setStep("crop");
            }}
            className="px-4 py-2 text-gray-700 rounded hover:underline"
          >
            Ajustar novamente
          </button>
        </div>
      )}

      {/* 4. Upload */}
      {step === "upload" && croppedBlob && (
        <ImageUploader
          blob={croppedBlob}
          onDone={(url) => {
            setImageUrl(url);
            setStep("done");
          }}
        />
      )}

      {/* 5. Resultado final */}
      {step === "done" && imageUrl && (
        <Image
          src={imageUrl}
          alt="Profile"
          width={128}
          height={128}
          className="rounded-full mt-4 object-cover"
        />
      )}
    </div>
  );
}
