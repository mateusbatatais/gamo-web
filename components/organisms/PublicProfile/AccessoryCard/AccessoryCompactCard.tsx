"use client";

import React from "react";
import Image from "next/image";
import { UserAccessory } from "@/@types/collection.types";
import { AccessoryActionButtons } from "../AccessoryActionButtons/AccessoryActionButtons";

interface AccessoryCompactCardProps {
  accessory: UserAccessory;
  isOwner: boolean;
}

export const AccessoryCompactCard = ({ accessory, isOwner }: AccessoryCompactCardProps) => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow aspect-square relative group">
      {isOwner && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <AccessoryActionButtons accessory={accessory} isOwner={isOwner} compact />
        </div>
      )}

      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
        {accessory.photoMain ? (
          <Image
            src={accessory.photoMain}
            alt={accessory.variantName || "Acessório"}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
            className="object-cover"
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
