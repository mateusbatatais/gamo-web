"use client";

import React from "react";
import Image from "next/image";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";

interface AccessoryCompactCardProps {
  accessory: UserAccessory;
  isOwner?: boolean;
  type?: "collection" | "trade";
}

export const AccessoryCompactCard = ({ accessory, isOwner, type }: AccessoryCompactCardProps) => {
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(accessory.photoMain);
  const { getAccessoriesQueryKey } = useCatalogQueryKeys();

  return (
    <div
      className={`
        rounded-lg border overflow-hidden hover:shadow-md transition-shadow aspect-square relative group
        ${
          accessory.isFavorite
            ? "!border-primary-700 border-2 shadow-md shadow-primary-100 dark:shadow-primary-900/20"
            : "border-gray-200 dark:border-gray-700"
        }
      `}
    >
      {isOwner && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <AccessoryActionButtons accessory={accessory} isOwner={isOwner} type={type} compact />
        </div>
      )}

      {isOwner && accessory.accessoryId && (
        <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
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

      <div
        className={`
            w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
            transition-all duration-300 ease-in-out
            ${
              accessory.status === "PREVIOUSLY_OWNED"
                ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                : ""
            }
          `}
      >
        {safeImageUrl ? (
          <Image
            src={safeImageUrl}
            alt={accessory.variantName || "Acessório"}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-xl">🎮</span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
        <span className="text-white text-xs font-medium text-center px-2 line-clamp-2">
          {accessory.variantName || "Acessório"}
        </span>
      </div>
    </div>
  );
};
