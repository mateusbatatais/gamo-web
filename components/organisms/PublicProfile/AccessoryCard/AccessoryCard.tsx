// components/organisms/PublicProfile/AccessoryCard/AccessoryCard.tsx
"use client";

import React from "react";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";

interface AccessoryCardProps {
  accessory: UserAccessory;
  isOwner?: boolean;
  type?: "collection" | "trade";
}

export const AccessoryCard = ({ accessory, isOwner, type }: AccessoryCardProps) => {
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(accessory.photoMain);
  const { getAccessoriesQueryKey } = useCatalogQueryKeys();
  const t = useTranslations("PublicProfile");
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
        relative rounded-xl border overflow-hidden hover:shadow-lg transition-shadow
        border-gray-200 dark:border-gray-700
      `}
    >
      {!isOwner && accessory.isFavorite && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-full text-primary-500 shadow-sm">
            <Heart size={16} fill="currentColor" />
          </div>
        </div>
      )}
      <Link
        href={modalUrl}
        scroll={false}
        className={`
            block h-48 bg-gray-100 dark:bg-gray-700 relative 
            transition-all duration-300 ease-in-out cursor-pointer group
            ${
              accessory.status === "PREVIOUSLY_OWNED"
                ? "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                : ""
            }
          `}
      >
        <SafeImage
          src={safeImageUrl}
          alt={accessory.variantName || "Acessório"}
          sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={true}
        />

        {accessory.status === "PREVIOUSLY_OWNED" && (
          <div className="absolute bottom-2 left-2 z-10">
            <div className="bg-gray-600/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              {t("previouslyOwned")}
            </div>
          </div>
        )}
      </Link>

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
