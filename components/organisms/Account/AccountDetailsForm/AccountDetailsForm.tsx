// components/Account/AccountDetailsForm/AccountDetailsForm.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { InputPhone } from "@/components/atoms/InputPhone/InputPhone";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { useToast } from "@/contexts/ToastContext";
import { Card } from "@/components/atoms/Card/Card";
import { useAccount } from "@/hooks/account/useUserAccount";
import { Avatar } from "@/components/atoms/Avatar/Avatar";
import { LocationData, LocationInput } from "@/components/molecules/LocationInput/LocationInput";

export default function AccountDetailsForm() {
  const { profileQuery, updateProfileMutation, uploadProfileImage } = useAccount();
  const { showToast } = useToast();
  const t = useTranslations("account.detailsForm");

  // Estados locais para o formulário
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [previewCroppedUrl, setPreviewCroppedUrl] = useState<string | null>(null);

  // Preenche os campos quando os dados são carregados
  React.useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name);
      setSlug(profileQuery.data.slug);
      setEmail(profileQuery.data.email);
      setPhone(profileQuery.data.phone || "");
      setDescription(profileQuery.data.description ?? "");

      // Set location data if available
      if (profileQuery.data.address || profileQuery.data.city) {
        setLocationData({
          formattedAddress:
            profileQuery.data.address || `${profileQuery.data.city}, ${profileQuery.data.state}`,
          address: profileQuery.data.address || "",
          zipCode: profileQuery.data.zipCode || "",
          city: profileQuery.data.city || "",
          state: profileQuery.data.state || "",
          latitude: profileQuery.data.latitude || 0,
          longitude: profileQuery.data.longitude || 0,
        });
      }
    }
  }, [profileQuery.data]);

  // Gerenciamento do preview da imagem
  const previewUrl = profileQuery.data?.profileImage || null;

  const handleCroppedImage = useCallback((blob: Blob) => {
    setCroppedBlob(blob);
    setPreviewCroppedUrl(URL.createObjectURL(blob));
    setFileSrc(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let profileImageUrl = previewUrl;

      if (croppedBlob) {
        const uploadResult = await uploadProfileImage.mutateAsync(croppedBlob);
        profileImageUrl = uploadResult.url;
      }

      await updateProfileMutation.mutateAsync({
        name,
        slug,
        description,
        email,
        phone,
        address: locationData?.address || null,
        zipCode: locationData?.zipCode || null,
        city: locationData?.city || null,
        state: locationData?.state || null,
        latitude: locationData?.latitude || null,
        longitude: locationData?.longitude || null,
        ...(profileImageUrl ? { profileImage: profileImageUrl } : {}),
      });

      showToast(t("updateSuccess"), "success");
    } catch {
      showToast(t("updateError"), "danger");
    }
  };

  if (profileQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (profileQuery.isError) {
    return <div>Error loading profile</div>;
  }

  return (
    <>
      {fileSrc && (
        <ImageCropper
          src={fileSrc}
          aspect={1}
          onBlobReady={handleCroppedImage}
          setFileSrc={setFileSrc}
          onCancel={() => setFileSrc(null)}
        />
      )}

      {!fileSrc && (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex flex-col items-center">
              {previewCroppedUrl ? (
                <Image
                  src={previewCroppedUrl}
                  alt="Avatar preview"
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              ) : previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              ) : (
                <Avatar alt={name} size="xl" />
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
              />

              <Input
                type="text"
                data-testid="input-slug"
                label={t("slug")}
                placeholder={t("slug")}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />

              <Input
                type="email"
                data-testid="input-email"
                label={t("email")}
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <InputPhone
                data-testid="input-phone"
                label={t("phone") || "Phone"}
                value={phone}
                onChange={setPhone}
                placeholder="+55 (11) 99999-9999"
                defaultCountry="BR"
              />

              <Textarea
                data-testid="input-textarea-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded h-24"
                placeholder={t("descriptionPlaceholder")}
                label={t("description")}
              />

              <LocationInput
                label={t("location") || "Localização"}
                placeholder="Digite sua cidade ou endereço..."
                value={locationData}
                onChange={setLocationData}
                data-testid="input-location"
                successMessage={t("locationSuccess") || "Localização obtida com sucesso!"}
              />
            </Card>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending || uploadProfileImage.isPending}
              label={
                updateProfileMutation.isPending || uploadProfileImage.isPending
                  ? t("saving")
                  : t("saveChanges")
              }
              data-testid="button-save"
            />
          </div>
        </form>
      )}
    </>
  );
}
