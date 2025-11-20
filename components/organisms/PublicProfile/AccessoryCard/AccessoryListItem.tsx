"use client";

import React from "react";
import Image from "next/image";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Card } from "@/components/atoms/Card/Card";
import { useTranslations } from "next-intl";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";

interface AccessoryListItemProps {
  accessory: UserAccessory;
  isOwner?: boolean;
  type?: "collection" | "trade";
}

export const AccessoryListItem = ({ accessory, isOwner, type }: AccessoryListItemProps) => {
  const t = useTranslations("PublicProfile");
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(accessory.photoMain);
  const { getAccessoriesQueryKey } = useCatalogQueryKeys();

  return (
    <Card
      className={`
        overflow-hidden hover:shadow-lg transition-shadow !p-4
        ${
          accessory.isFavorite
            ? "!border-primary-700 border-2 shadow-md shadow-primary-100 dark:shadow-primary-900/20"
            : "border border-gray-200 dark:border-gray-700"
        }
      `}
    >
      <div className="flex items-center gap-4">
        <div
          className={`
              w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
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
              sizes="80px"
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-2xl">🎮</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg dark:text-white line-clamp-1">
                {accessory.variantName || "Acessório"}
                {accessory.status === "PREVIOUSLY_OWNED" && (
                  <span className="text-sm text-gray-700 font-normal">
                    {" "}
                    ({t("previouslyOwned")})
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {accessory.type &&
                  `${accessory.type}${accessory.subType ? ` • ${accessory.subType}` : ""}`}
              </p>
            </div>

            <div className="flex gap-2 items-center">
              {isOwner && accessory.accessoryId && (
                <FavoriteToggle
                  itemId={accessory.accessoryId}
                  itemType="ACCESSORY"
                  isFavorite={accessory.isFavorite}
                  queryKey={getAccessoriesQueryKey()}
                  size="sm"
                />
              )}

              <AccessoryActionButtons
                accessory={accessory}
                isOwner={isOwner}
                type={type}
                // Removemos o botão de favorito do AccessoryActionButtons
                // já que agora ele está integrado aqui
              />
            </div>
          </div>

          {accessory.price && (
            <p className="font-bold text-secondary-600 dark:text-secondary-400 text-sm">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "BRL",
              }).format(accessory.price)}
            </p>
          )}

          <div className="mt-2 flex gap-2 flex-wrap">
            {accessory.hasBox && !accessory.hasManual && (
              <Badge status="info" size="sm">
                {t("withBox")}
              </Badge>
            )}

            {accessory.hasManual && !accessory.hasBox && (
              <Badge status="success" size="sm">
                {t("withManual")}
              </Badge>
            )}

            {accessory.hasManual && accessory.hasBox && (
              <Badge status="success" size="sm">
                CIB
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
