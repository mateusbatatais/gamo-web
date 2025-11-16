// components/organisms/PublicProfile/AccessoryCard/AccessoryCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";

interface AccessoryCardProps {
  accessory: UserAccessory;
  isOwner?: boolean;
  type?: "collection" | "trade";
}

export const AccessoryCard = ({ accessory, isOwner, type }: AccessoryCardProps) => {
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(accessory.photoMain);
  const { getAccessoriesQueryKey } = useCatalogQueryKeys();

  return (
    <div
      className={`
        relative rounded-xl border overflow-hidden hover:shadow-lg transition-shadow
        ${
          accessory.isFavorite
            ? "!border-primary-700 border-2 shadow-md shadow-primary-100 dark:shadow-primary-900/20"
            : "border-gray-200 dark:border-gray-700"
        }
      `}
    >
      <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
        {safeImageUrl ? (
          <Image
            src={safeImageUrl}
            alt={accessory.variantName || "Acessório"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-3xl">🎮</span>
          </div>
        )}
      </div>

      {/* Botão de favorito - posicionado separadamente dos outros botões */}
      {isOwner && accessory.accessoryId && (
        <div className="absolute top-2 left-2 z-10">
          <FavoriteToggle
            itemId={accessory.accessoryId}
            itemType="ACCESSORY"
            isFavorite={accessory.isFavorite}
            queryKey={getAccessoriesQueryKey()}
            size="sm"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
          />
        </div>
      )}

      <AccessoryActionButtons
        accessory={accessory}
        type={type}
        isOwner={isOwner}
        customClassName="absolute top-2 right-2 z-10"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg dark:text-white">
              {accessory.variantName || "Acessório"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{accessory.accessorySlug}</p>
          </div>
        </div>

        {accessory.price && (
          <p className="font-bold text-secondary-600 dark:text-secondary-400 mt-2">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "BRL",
            }).format(accessory.price)}
          </p>
        )}

        {accessory.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
            {accessory.description}
          </p>
        )}
      </div>
    </div>
  );
};
