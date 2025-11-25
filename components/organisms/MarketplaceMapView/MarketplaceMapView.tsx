// components/organisms/MarketplaceMapView/MarketplaceMapView.tsx
"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";
import { MarketplaceItem } from "@/@types/catalog.types";
import Link from "next/link";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { Button } from "@/components/atoms/Button/Button";
import { MapPin, User } from "lucide-react";

interface MarketplaceMapViewProps {
  items: MarketplaceItem[];
}

const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh - 200px)",
  minHeight: "500px",
};

// Constante para libraries (evita recarregamento do LoadScript)
const GOOGLE_MAPS_LIBRARIES: Libraries = ["places"];

// Função para obter cor do marcador por tipo de item
const getMarkerColor = (itemType: "GAME" | "CONSOLE" | "ACCESSORY"): string => {
  const colors = {
    GAME: "#3B82F6", // blue
    CONSOLE: "#10B981", // green
    ACCESSORY: "#F59E0B", // amber
  };
  return colors[itemType];
};

export default function MarketplaceMapView({ items }: MarketplaceMapViewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { getSafeImageUrl } = useSafeImageUrl();

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Erro ao obter localização:", error);
          // Continua sem localização do usuário
        },
      );
    }
  }, []);

  // Filtrar items que têm localização
  const itemsWithLocation = useMemo(
    () => items.filter((item) => item.latitude != null && item.longitude != null),
    [items],
  );

  // Calcular centro padrão (prioriza localização do usuário)
  const defaultCenter = useMemo(() => {
    // Se temos localização do usuário, usa ela
    if (userLocation) {
      return userLocation;
    }

    if (itemsWithLocation.length === 0) {
      return { lat: -14.235, lng: -51.9253 }; // Brasil
    }

    if (itemsWithLocation.length === 1) {
      return {
        lat: itemsWithLocation[0].latitude!,
        lng: itemsWithLocation[0].longitude!,
      };
    }

    // Calcular centro médio
    const sumLat = itemsWithLocation.reduce((sum, item) => sum + item.latitude!, 0);
    const sumLng = itemsWithLocation.reduce((sum, item) => sum + item.longitude!, 0);
    return {
      lat: sumLat / itemsWithLocation.length,
      lng: sumLng / itemsWithLocation.length,
    };
  }, [itemsWithLocation, userLocation]);

  // Calcular zoom apropriado (zoom 11 para ~50km de raio)
  const defaultZoom = useMemo(() => {
    if (userLocation) {
      return 11; // ~50km de raio
    }
    return itemsWithLocation.length === 1 ? 12 : 10;
  }, [userLocation, itemsWithLocation.length]);

  // Ajustar bounds quando mapa carregar (desabilitado quando temos userLocation)
  useEffect(() => {
    if (!map || !isLoaded || itemsWithLocation.length <= 1 || userLocation) return;

    const bounds = new google.maps.LatLngBounds();
    itemsWithLocation.forEach((item) => {
      bounds.extend({ lat: item.latitude!, lng: item.longitude! });
    });
    map.fitBounds(bounds);
  }, [map, isLoaded, itemsWithLocation, userLocation]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Criar ícone customizado
  const createMarkerIcon = useCallback(
    (itemType: "GAME" | "CONSOLE" | "ACCESSORY") => {
      if (!isLoaded) return undefined;

      const color = getMarkerColor(itemType);
      const svg = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="3"/>
      </svg>
    `;
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16),
      };
    },
    [isLoaded],
  );

  // Renderizar InfoWindow
  const renderInfoWindow = (item: MarketplaceItem) => {
    const safeImageUrl = getSafeImageUrl(item.photoMain || item.imageUrl);
    const formattedPrice = item.price
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(item.price)
      : null;

    const tradeType = item.status === "SELLING" ? "selling" : "looking";

    return (
      <InfoWindow
        position={{ lat: item.latitude!, lng: item.longitude! }}
        onCloseClick={() => setSelectedItem(null)}
      >
        <div className="max-w-xs">
          <div className="relative h-32 w-full mb-2 rounded overflow-hidden">
            <SafeImage
              src={safeImageUrl}
              alt={item.name}
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>

          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>

          {formattedPrice && (
            <p className="text-primary-600 font-bold text-lg mb-2">{formattedPrice}</p>
          )}

          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
            <User size={12} />
            <span className="truncate">{item.seller.name}</span>
          </div>

          {(item.city || item.state) && (
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
              <MapPin size={12} />
              <span className="truncate">
                {item.city}
                {item.city && item.state && ", "}
                {item.state}
              </span>
            </div>
          )}

          <Link href={`/user/${item.seller.slug}/market?tradetype=${tradeType}`}>
            <Button variant="primary" size="sm" label="Ver detalhes" className="w-full" />
          </Link>
        </div>
      </InfoWindow>
    );
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Erro ao carregar o mapa</p>
          <p className="text-sm text-gray-500">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (itemsWithLocation.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">Nenhum item com localização</p>
          <p className="text-sm text-gray-500">
            Os items filtrados não possuem informações de localização
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={defaultZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {/* Marcador da localização do usuário */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 3,
              scale: 10,
            }}
            title="Sua localização"
            zIndex={1000}
          />
        )}

        {/* Marcadores dos items */}
        {itemsWithLocation.map((item) => (
          <Marker
            key={`${item.itemType}-${item.id}`}
            position={{ lat: item.latitude!, lng: item.longitude! }}
            onClick={() => setSelectedItem(item)}
            icon={createMarkerIcon(item.itemType)}
            title={item.name}
          />
        ))}

        {selectedItem && renderInfoWindow(selectedItem)}
      </GoogleMap>
    </div>
  );
}
