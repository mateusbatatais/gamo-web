// hooks/location/useGoogleMapsPlaces.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";

export interface PlaceDetails {
  zipCode: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

interface GoogleMapsPlacePrediction {
  text?: { toString: () => string };
  placeId?: string;
}

interface GoogleMapsAutocompleteSuggestion {
  placePrediction?: GoogleMapsPlacePrediction;
}

interface GoogleMapsAddressComponent {
  types: string[];
  longText?: string;
  shortText?: string;
  long_name?: string;
  short_name?: string;
}

interface GoogleMapsLocation {
  lat: () => number;
  lng: () => number;
}

interface GoogleMapsPlace {
  id: string;
  addressComponents?: GoogleMapsAddressComponent[];
  location?: GoogleMapsLocation;
  formattedAddress?: string;
  fetchFields: (options: { fields: string[] }) => Promise<void>;
}

interface GoogleMapsPlacesLibrary {
  Place: new (options: { id: string }) => GoogleMapsPlace;
}

interface GoogleMapsGeocoderResult {
  address_components?: GoogleMapsAddressComponent[];
  formatted_address?: string;
}

interface GoogleMapsGeocoder {
  geocode: (
    request: { location: { lat: number; lng: number } },
    callback: (results: GoogleMapsGeocoderResult[] | null, status: string) => void,
  ) => void;
}

interface GoogleMapsAPI {
  maps: {
    places: {
      AutocompleteSuggestion: {
        fetchAutocompleteSuggestions: (options: {
          input: string;
          includedRegionCodes: string[];
        }) => Promise<{ suggestions: GoogleMapsAutocompleteSuggestion[] }>;
      };
    };
    importLibrary: (library: string) => Promise<GoogleMapsPlacesLibrary>;
    Geocoder: new () => GoogleMapsGeocoder;
    GeocoderStatus: {
      OK: string;
    };
  };
}

declare global {
  interface Window {
    initGoogleMaps?: () => void;
    google?: GoogleMapsAPI;
  }
}

export function useGoogleMapsPlaces() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AutoCompleteItem[]>([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      window.initGoogleMaps = () => {
        setIsGoogleMapsLoaded(true);
      };
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    window.initGoogleMaps = () => {
      setIsGoogleMapsLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };

    document.head.appendChild(script);

    return () => {
      delete window.initGoogleMaps;
    };
  }, []);

  const searchPlaces = useCallback(
    async (query: string): Promise<void> => {
      if (!query || !isGoogleMapsLoaded) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      try {
        if (!window.google) {
          console.error("Google Maps API not available");
          setSuggestions([]);
          return;
        }

        const response =
          await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
            includedRegionCodes: ["br"],
          });

        const placeSuggestions = response.suggestions;

        if (placeSuggestions && placeSuggestions.length > 0) {
          const items: AutoCompleteItem[] = placeSuggestions.map(
            (suggestion: GoogleMapsAutocompleteSuggestion, index: number) => ({
              id: index,
              label: suggestion.placePrediction?.text?.toString() ?? "",
              placeId: suggestion.placePrediction?.placeId ?? "",
            }),
          );
          setSuggestions(items);
        } else {
          setSuggestions([]);
        }
      } catch (error: unknown) {
        console.error("Error searching places:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [isGoogleMapsLoaded],
  );

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<PlaceDetails | null> => {
      if (!isGoogleMapsLoaded) {
        console.error("Google Maps not loaded");
        return null;
      }

      try {
        if (!window.google) {
          console.error("Google Maps API not available");
          return null;
        }

        const placesLibrary = await window.google.maps.importLibrary("places");
        const { Place } = placesLibrary;

        const place = new Place({
          id: placeId,
        });

        await place.fetchFields({
          fields: ["addressComponents", "location", "formattedAddress"],
        });

        if (!place.addressComponents || !place.location) {
          return null;
        }

        let zipCode = "";
        let city = "";
        let state = "";

        place.addressComponents.forEach((component: GoogleMapsAddressComponent) => {
          const types = component.types;

          if (types.includes("postal_code")) {
            zipCode = component.longText ?? "";
          }
          if (types.includes("administrative_area_level_2") || types.includes("locality")) {
            city = component.longText ?? "";
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.shortText ?? "";
          }
        });

        return {
          zipCode,
          city,
          state,
          latitude: place.location.lat(),
          longitude: place.location.lng(),
          formattedAddress: place.formattedAddress ?? "",
        };
      } catch (error: unknown) {
        console.error("Error getting place details:", error);
        return null;
      }
    },
    [isGoogleMapsLoaded],
  );

  const getCurrentLocation = useCallback(async (): Promise<PlaceDetails | null> => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }

    if (!isGoogleMapsLoaded) {
      throw new Error("Google Maps is not loaded yet");
    }

    return new Promise<PlaceDetails | null>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;

          try {
            if (!window.google) {
              reject(new Error("Google Maps API not available"));
              return;
            }

            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results: GoogleMapsGeocoderResult[] | null, status: string) => {
                if (status === window.google!.maps.GeocoderStatus.OK && results && results[0]) {
                  const place = results[0];

                  let zipCode = "";
                  let city = "";
                  let state = "";

                  place.address_components?.forEach((component: GoogleMapsAddressComponent) => {
                    const types = component.types;

                    if (types.includes("postal_code")) {
                      zipCode = component.long_name ?? "";
                    }
                    if (
                      types.includes("administrative_area_level_2") ||
                      types.includes("locality")
                    ) {
                      city = component.long_name ?? "";
                    }
                    if (types.includes("administrative_area_level_1")) {
                      state = component.short_name ?? "";
                    }
                  });

                  const placeDetails: PlaceDetails = {
                    zipCode,
                    city,
                    state,
                    latitude,
                    longitude,
                    formattedAddress: place.formatted_address ?? "",
                  };

                  resolve(placeDetails);
                } else {
                  reject(new Error("Unable to get address from coordinates"));
                }
              },
            );
          } catch (error: unknown) {
            reject(error);
          }
        },
        (error: GeolocationPositionError) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error("User denied the request for Geolocation"));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error("Location information is unavailable"));
              break;
            case error.TIMEOUT:
              reject(new Error("The request to get user location timed out"));
              break;
            default:
              reject(new Error("An unknown error occurred"));
              break;
          }
        },
      );
    });
  }, [isGoogleMapsLoaded]);

  return {
    loading,
    suggestions,
    searchPlaces,
    getPlaceDetails,
    getCurrentLocation,
    isGoogleMapsLoaded,
  };
}
