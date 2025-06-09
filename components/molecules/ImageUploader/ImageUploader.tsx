"use client";

import React, { useState } from "react";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import Toast, { ToastType } from "@/components/molecules/Toast/Toast";

interface ImageUploaderProps {
  blob: Blob;
  onDone: (url: string) => void;
}

export default function ImageUploader({ blob, onDone }: ImageUploaderProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  async function upload() {
    setLoading(true);
    setToast(null);

    try {
      // 1) Envia o blob para Cloudinary via backend
      const formData = new FormData();
      formData.append("file", blob, "upload.jpg");

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads/profile`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });
      if (!uploadRes.ok) {
        throw new Error("Upload falhou");
      }
      const { url } = (await uploadRes.json()) as { url: string; publicId: string };

      // 2) Salva a URL no perfil do usuário
      await apiFetch("/user/profile", {
        token,
        method: "PUT",
        body: { profileImage: url },
      });

      setToast({ type: "success", message: "Imagem enviada com sucesso!" });
      onDone(url);
    } catch (err: unknown) {
      console.error(err);
      setToast({ type: "danger", message: "Falha ao enviar imagem." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      {toast && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center">
          <Toast
            type={toast.type}
            message={toast.message}
            durationMs={3000}
            onClose={() => setToast(null)}
          />
        </div>
      )}
      <button
        onClick={upload}
        disabled={loading}
        className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar imagem"}
      </button>
    </div>
  );
}
