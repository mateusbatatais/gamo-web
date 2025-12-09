"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import clsx from "clsx";

interface AccessoryCompactCardProps {
  accessory: UserAccessory;
  isOwner?: boolean;
  type?: "collection" | "trade";
}

export const AccessoryCompactCard = ({ accessory, isOwner, type }: AccessoryCompactCardProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(accessory.photoMain);
  const { getAccessoriesQueryKey } = useCatalogQueryKeys();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentParams = new URLSearchParams(searchParams.toString());
  if (accessory.id) {
    currentParams.set("accessory", accessory.id.toString());
  }
  const modalUrl = `${pathname}?${currentParams.toString()}`;

  return (
    <div
      className={`
        rounded-lg border overflow-hidden hover:shadow-md transition-shadow aspect-square relative group
        border-gray-200 dark:border-gray-700
      `}
    >
      {!isOwner && accessory.isFavorite && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-full text-primary-500 shadow-sm">
            <Heart size={12} fill="currentColor" />
          </div>
        </div>
      )}
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

      <Link
        href={modalUrl}
        scroll={false}
        className={`
            block w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
            transition-all duration-300 ease-in-out cursor-pointer
            ${
              accessory.status === "PREVIOUSLY_OWNED"
                ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                : ""
            }
          `}
      >
        {safeImageUrl ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin" />
              </div>
            )}
            <Image
              src={safeImageUrl}
              alt={accessory.variantName || "Acessório"}
              fill
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
              className={clsx(
                "object-cover transition-opacity duration-500",
                isImageLoading ? "opacity-0" : "opacity-100",
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-xl">🎮</span>
          </div>
        )}
      </Link>

      <Link
        href={modalUrl}
        scroll={false}
        className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
      >
        <span className="text-white text-xs font-medium text-center px-2 line-clamp-2">
          {accessory.variantName || "Acessório"}
        </span>
      </Link>
    </div>
  );
};
