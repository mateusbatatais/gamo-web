// components/molecules/LocationInput/LocationInput.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";
import { useGoogleMapsPlaces } from "@/hooks/location/useGoogleMapsPlaces";
import { MapPin } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export interface LocationData {
  formattedAddress: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface LocationInputProps {
  label?: string;
  placeholder?: string;
  value?: LocationData | null;
  onChange?: (locationData: LocationData | null) => void;
  disabled?: boolean;
  required?: boolean;
  "data-testid"?: string;
  successMessage?: string;
  errorMessage?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label = "Localização",
  placeholder = "Digite sua cidade ou endereço...",
  value,
  onChange,
  disabled = false,
  required = false,
  "data-testid": dataTestId = "input-location",
  successMessage = "Localização obtida com sucesso!",
  errorMessage,
}) => {
  const { showToast } = useToast();
  const [displayValue, setDisplayValue] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);

  const {
    loading: placesLoading,
    suggestions,
    searchPlaces,
    getPlaceDetails,
    getCurrentLocation,
  } = useGoogleMapsPlaces();

  // Sync display value with external value prop
  useEffect(() => {
    if (value?.formattedAddress) {
      setDisplayValue(value.formattedAddress);
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleLocationSelect = useCallback(
    async (item: AutoCompleteItem) => {
      const placeId = item.placeId as string;
      if (!placeId) return;

      const details = await getPlaceDetails(placeId);
      if (details) {
        const locationData: LocationData = {
          formattedAddress: details.formattedAddress,
          address: details.formattedAddress,
          zipCode: details.zipCode,
          city: details.city,
          state: details.state,
          latitude: details.latitude,
          longitude: details.longitude,
        };

        setDisplayValue(details.formattedAddress);
        onChange?.(locationData);
      }
    },
    [getPlaceDetails, onChange],
  );

  const handleGetCurrentLocation = useCallback(async () => {
    setGettingLocation(true);
    try {
      const details = await getCurrentLocation();
      if (details) {
        const locationData: LocationData = {
          formattedAddress: details.formattedAddress,
          address: details.formattedAddress,
          zipCode: details.zipCode,
          city: details.city,
          state: details.state,
          latitude: details.latitude,
          longitude: details.longitude,
        };

        setDisplayValue(details.formattedAddress);
        onChange?.(locationData);
        showToast(successMessage, "success");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : errorMessage || "Erro ao obter localização";
      showToast(message, "danger");
    } finally {
      setGettingLocation(false);
    }
  }, [getCurrentLocation, onChange, showToast, successMessage, errorMessage]);

  return (
    <div className="relative">
      <AutoComplete
        data-testid={dataTestId}
        label={label}
        placeholder={placeholder}
        value={displayValue}
        items={suggestions}
        onSearch={searchPlaces}
        onItemSelect={handleLocationSelect}
        loading={placesLoading}
        disabled={disabled}
        required={required}
        renderItem={(item) => (
          <div className="flex items-center gap-3 p-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
            </div>
          </div>
        )}
      />
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={gettingLocation || disabled}
        className="absolute right-2 top-7 p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Usar minha localização atual"
        data-testid={`${dataTestId}-get-location`}
      >
        <MapPin size={20} className={gettingLocation ? "animate-pulse" : ""} />
      </button>
    </div>
  );
};
