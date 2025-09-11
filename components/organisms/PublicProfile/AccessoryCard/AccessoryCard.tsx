"use client";

import React from "react";
import Image from "next/image";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";

interface AccessoryCardProps {
  accessory: UserAccessory;
  isOwner: boolean;
}

export const AccessoryCard = ({ accessory, isOwner }: AccessoryCardProps) => {
  return (
    <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
        {accessory.photoMain ? (
          <Image
            src={accessory.photoMain}
            alt={accessory.variantName || "Acessório"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-3xl">🎮</span>
          </div>
        )}
      </div>
      <AccessoryActionButtons
        accessory={accessory}
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
