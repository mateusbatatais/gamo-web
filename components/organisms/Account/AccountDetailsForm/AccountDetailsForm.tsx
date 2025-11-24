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
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";
import { MapPin } from "lucide-react";
import { useGoogleMapsPlaces } from "@/hooks/location/useGoogleMapsPlaces";

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
  const [location, setLocation] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [previewCroppedUrl, setPreviewCroppedUrl] = useState<string | null>(null);

  const {
    loading: placesLoading,
    suggestions,
    searchPlaces,
    getPlaceDetails,
    getCurrentLocation,
  } = useGoogleMapsPlaces();

  const [gettingLocation, setGettingLocation] = useState(false);

  // Preenche os campos quando os dados são carregados
  React.useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name);
      setSlug(profileQuery.data.slug);
      setEmail(profileQuery.data.email);
      setPhone(profileQuery.data.phone || "");
      setDescription(profileQuery.data.description ?? "");
      setZipCode(profileQuery.data.zipCode || "");
      setCity(profileQuery.data.city || "");
      setState(profileQuery.data.state || "");
      setLatitude(profileQuery.data.latitude || null);
      setLongitude(profileQuery.data.longitude || null);

      // Set location display text if we have city and state
      if (profileQuery.data.city && profileQuery.data.state) {
        setLocation(`${profileQuery.data.city}, ${profileQuery.data.state}`);
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

  const handleLocationSelect = useCallback(
    async (item: AutoCompleteItem) => {
      const placeId = item.placeId as string;
      if (!placeId) return;

      const details = await getPlaceDetails(placeId);
      if (details) {
        setLocation(details.formattedAddress);
        setZipCode(details.zipCode);
        setCity(details.city);
        setState(details.state);
        setLatitude(details.latitude);
        setLongitude(details.longitude);
      }
    },
    [getPlaceDetails],
  );

  const handleGetCurrentLocation = useCallback(async () => {
    setGettingLocation(true);
    try {
      const details = await getCurrentLocation();
      if (details) {
        setLocation(details.formattedAddress);
        setZipCode(details.zipCode);
        setCity(details.city);
        setState(details.state);
        setLatitude(details.latitude);
        setLongitude(details.longitude);
        showToast(t("locationSuccess") || "Localização obtida com sucesso!", "success");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao obter localização";
      showToast(errorMessage, "danger");
    } finally {
      setGettingLocation(false);
    }
  }, [getCurrentLocation, showToast, t]);

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
        zipCode: zipCode || null,
        city: city || null,
        state: state || null,
        latitude: latitude || null,
        longitude: longitude || null,
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

              <div className="relative">
                <AutoComplete
                  data-testid="input-location"
                  label={t("location") || "Localização"}
                  placeholder="Digite sua cidade ou endereço..."
                  value={location}
                  items={suggestions}
                  onSearch={searchPlaces}
                  onItemSelect={handleLocationSelect}
                  loading={placesLoading}
                  renderItem={(item) => (
                    <div className="flex items-center gap-3 p-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  )}
                />
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                  className="absolute right-2 top-7 p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t("getCurrentLocation") || "Usar minha localização atual"}
                  data-testid="button-get-location"
                >
                  <MapPin size={20} className={gettingLocation ? "animate-pulse" : ""} />
                </button>
              </div>
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
