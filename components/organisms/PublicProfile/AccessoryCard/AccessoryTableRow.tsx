"use client";

import React from "react";
import Image from "next/image";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";

interface AccessoryTableRowProps {
  accessory: UserAccessory;
  isOwner?: boolean;
  type?: "collection" | "trade";
}

export const AccessoryTableRow = ({ accessory, isOwner, type }: AccessoryTableRowProps) => {
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(accessory.photoMain);

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="py-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
            {safeImageUrl ? (
              <Image
                src={safeImageUrl}
                alt={accessory.variantName || "Acessório"}
                fill
                sizes="48px"
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
          <div>
            <h3 className="font-medium dark:text-white">{accessory.variantName || "Acessório"}</h3>
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
          <AccessoryActionButtons accessory={accessory} isOwner={isOwner} type={type} />
        </td>
      )}
    </tr>
  );
};
