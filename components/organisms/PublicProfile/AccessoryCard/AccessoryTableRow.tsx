"use client";

import React from "react";
import Image from "next/image";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { FavoriteToggle } from "@/components/atoms/FavoriteToggle/FavoriteToggle";
import { useCatalogQueryKeys } from "@/hooks/useCatalogQueryKeys";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface AccessoryTableRowProps {
  accessory: UserAccessory;
  isOwner?: boolean;
  type?: "collection" | "trade";
}

export const AccessoryTableRow = ({ accessory, isOwner, type }: AccessoryTableRowProps) => {
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
    <tr
      className={`
        border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800
        ${accessory.isFavorite ? "bg-primary-50 dark:bg-primary-900/20" : ""}
      `}
    >
      <td className="py-2">
        <div className="flex items-center gap-3">
          <Link
            href={modalUrl}
            scroll={false}
            className={`
              block w-12 h-12 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative
              transition-all duration-300 ease-in-out cursor-pointer group
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
                sizes="48px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
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
          </Link>
          <div>
            <Link href={modalUrl} scroll={false} className="hover:underline decoration-primary-500">
              <h3 className="font-medium dark:text-white hover:text-primary-500 transition-colors">
                {accessory.variantName || "Acessório"}
                {accessory.status === "PREVIOUSLY_OWNED" && (
                  <span className="text-sm text-gray-700 font-normal">
                    {" "}
                    ({t("previouslyOwned")})
                  </span>
                )}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {accessory.type &&
                `${accessory.type}${accessory.subType ? ` • ${accessory.subType}` : ""}`}
            </p>
          </div>
        </div>
      </td>

      <td className="p-2">
        {accessory.price ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "BRL",
            }).format(accessory.price)}
          </p>
        ) : (
          <span className="text-sm text-gray-500">-</span>
        )}
      </td>

      <td className="p-2">
        {accessory.condition ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{accessory.condition}</p>
        ) : (
          <span className="text-sm text-gray-500">-</span>
        )}
      </td>

      {isOwner && (
        <td className="p-2">
          <div className="flex gap-2">
            {accessory.accessoryId && (
              <FavoriteToggle
                itemId={accessory.accessoryId}
                itemType="ACCESSORY"
                isFavorite={accessory.isFavorite}
                queryKey={getAccessoriesQueryKey()}
                size="sm"
              />
            )}

            <AccessoryActionButtons accessory={accessory} isOwner={isOwner} type={type} />
          </div>
        </td>
      )}
    </tr>
  );
};
