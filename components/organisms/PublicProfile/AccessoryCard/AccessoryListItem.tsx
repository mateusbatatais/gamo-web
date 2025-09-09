"use client";

import React from "react";
import Image from "next/image";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Card } from "@/components/atoms/Card/Card";
import { useTranslations } from "next-intl";

interface AccessoryListItemProps {
  accessory: UserAccessory;
  isOwner: boolean;
}

export const AccessoryListItem = ({ accessory, isOwner }: AccessoryListItemProps) => {
  const t = useTranslations("PublicProfile");

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow !p-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
          {accessory.photoMain ? (
            <Image
              src={accessory.photoMain}
              alt={accessory.variantName || "Acessório"}
              fill
              sizes="80px"
              className="object-cover"
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
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {accessory.type &&
                  `${accessory.type}${accessory.subType ? ` • ${accessory.subType}` : ""}`}
              </p>
            </div>
            <AccessoryActionButtons accessory={accessory} isOwner={isOwner} />
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
