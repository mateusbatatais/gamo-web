// components/Account/AccountDetailsForm/AccountDetailsForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import Toast, { ToastType } from "@/components/molecules/Toast/Toast";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import ProfileImagePlaceholder from "../ProfileImagePlaceholder/ProfileImagePlaceholder";
import { Textarea } from "@/components/atoms/Textarea/Textarea";

interface UserDetailsPayload {
  name: string;
  email: string;
  slug: string;
  description: string;
  profileImage?: string;
}

interface ApiError extends Error {
  code?: string;
}

export default function AccountDetailsForm() {
  const { token, user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [slug, setSlug] = useState(user?.slug || "");
  const [email, setEmail] = useState(user?.email || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || null);

  const t = useTranslations("account.detailsForm");
  const router = useRouter();

  // fetch profile
  useEffect(() => {
    if (!token) return;
    apiFetch<{
      name: string;
      slug: string;
      email: string;
      description?: string;
      profileImage?: string;
    }>("/user/profile", { token })
      .then((data) => {
        setName(data.name);
        setSlug(data.slug);
        setEmail(data.email);
        setDescription(data.description ?? "");
        setPreviewUrl(data.profileImage || null);
      })
      .catch((err) => {
        const apiErr = err as ApiError;
        if (apiErr.code === "UNAUTHORIZED") return void logout();
        setErrorMsg(t("fetchError"));
        setToast({ type: "danger", message: t("fetchError") });
      });
  }, [token, logout, t]);

  // when blob ready, set preview
  useEffect(() => {
    if (!croppedBlob) return;
    const url = URL.createObjectURL(croppedBlob);
    setPreviewUrl(url);
    setFileSrc(null);
    return () => URL.revokeObjectURL(url);
  }, [croppedBlob]);

  function closeToast() {
    setToast(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setToast(null);
    setLoading(true);

    try {
      let profileImageUrl = previewUrl;
      if (croppedBlob) {
        const formData = new FormData();
        formData.append("file", croppedBlob, "profile.jpg");

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads/profile`, {
          method: "POST",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const json = (await uploadRes.json()) as { url: string };
        profileImageUrl = json.url;
      }

      const payload: UserDetailsPayload = {
        name,
        email,
        description,
        slug,
        ...(profileImageUrl ? { profileImage: profileImageUrl } : {}),
      };

      await apiFetch("/user/profile", {
        token,
        method: "PUT",
        body: payload,
      });

      setToast({ type: "success", message: t("updateSuccess") });
      router.refresh();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.code === "UNAUTHORIZED") return void logout();
      const msg = apiErr.message || t("updateError");
      setErrorMsg(msg);
      setToast({ type: "danger", message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {toast && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center">
          <Toast {...toast} durationMs={5000} onClose={closeToast} />
        </div>
      )}

      {fileSrc && !previewUrl && (
        <div className="space-y-4">
          <ImageCropper src={fileSrc} aspect={1} onBlobReady={setCroppedBlob} />
          <Button variant="secondary" onClick={() => setFileSrc(null)} label={t("cancelCrop")} />
        </div>
      )}

      {!fileSrc && (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">{t("title")}</h2>

          <div className="flex flex-col items-center gap-2">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Avatar"
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            ) : (
              <ProfileImagePlaceholder />
            )}
            <Button
              type="button"
              label={t("selectPhoto")}
              onClick={() => document.getElementById("profileInput")?.click()}
              className="mt-2"
            />
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileSrc(URL.createObjectURL(file));
                  setPreviewUrl(null);
                }
              }}
            />
          </div>

          <Input
            type="text"
            label={t("name")}
            placeholder={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={errorMsg ?? undefined}
          />

          <Input
            type="text"
            label={t("slug")}
            placeholder={t("slug")}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            error={errorMsg ?? undefined}
          />

          <Input
            type="email"
            label={t("email")}
            disabled
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={errorMsg ?? undefined}
          />

          <div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded h-24"
              placeholder={t("descriptionPlaceholder")}
              label={t("description")}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            label={loading ? t("saving") : t("saveChanges")}
          />
        </form>
      )}
    </>
  );
}
