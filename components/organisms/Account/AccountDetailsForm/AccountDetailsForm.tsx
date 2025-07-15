// components/Account/AccountDetailsForm/AccountDetailsForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/utils/api";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import ProfileImagePlaceholder from "../ProfileImagePlaceholder/ProfileImagePlaceholder";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { useToast } from "@/contexts/ToastContext";
import { Card } from "@/components/atoms/Card/Card";

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
  const { token, user, logout, updateUser } = useAuth(); // Adicionado updateUser
  const [name, setName] = useState(user?.name || "");
  const [slug, setSlug] = useState(user?.slug || "");
  const [email, setEmail] = useState(user?.email || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImage || null);

  const t = useTranslations("account.detailsForm");
  const { showToast } = useToast();

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
        showToast(t("fetchError"), "danger");
      });
  }, [token, logout, t, showToast]);

  useEffect(() => {
    if (!croppedBlob) return;
    const url = URL.createObjectURL(croppedBlob);
    setPreviewUrl(url);
    setFileSrc(null);
    return () => URL.revokeObjectURL(url);
  }, [croppedBlob]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
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

      updateUser({
        name,
        slug,
        email,
        description,
        profileImage: profileImageUrl || "",
      });

      showToast(t("updateSuccess"), "success");
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.code === "UNAUTHORIZED") return void logout();
      const msg = apiErr.message || t("updateError");
      setErrorMsg(msg);
      showToast(msg, "danger");
    } finally {
      setLoading(false);
      if (croppedBlob) {
        setCroppedBlob(null);
      }
    }
  }

  return (
    <>
      {fileSrc && (
        <ImageCropper
          src={fileSrc}
          aspect={1}
          onBlobReady={setCroppedBlob}
          setFileSrc={setFileSrc}
          onCancel={() => setFileSrc(null)}
        />
      )}

      {!fileSrc && (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 mt-4 ">
            <div className="flex flex-col  items-center ">
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
                data-testid="button-select-photo"
              />
              <input
                id="profileInput"
                type="file"
                accept="image/*"
                className="hidden"
                data-testid="input-profile-image"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileSrc(URL.createObjectURL(file));
                    setPreviewUrl(null);
                  }
                }}
              />
            </div>
            <Card className="flex-1 space-y-6">
              <Input
                type="text"
                data-testid="input-name"
                label={t("name")}
                placeholder={t("name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                error={errorMsg ?? undefined}
              />

              <Input
                type="text"
                data-testid="input-slug"
                label={t("slug")}
                placeholder={t("slug")}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                error={errorMsg ?? undefined}
              />

              <Input
                type="email"
                data-testid="input-email"
                label={t("email")}
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={errorMsg ?? undefined}
              />

              <div>
                <Textarea
                  data-testid="input-textarea-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded h-24"
                  placeholder={t("descriptionPlaceholder")}
                  label={t("description")}
                />
              </div>
            </Card>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              label={loading ? t("saving") : t("saveChanges")}
              data-testid="button-save"
            />
          </div>
        </form>
      )}
    </>
  );
}
