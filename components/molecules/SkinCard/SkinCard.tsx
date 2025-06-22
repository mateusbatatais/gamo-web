// components/molecules/SkinCard/SkinCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { isValidUrl } from "@/utils/validate-url";
import { AddToCollectionButton } from "../AddToCollectionButton/AddToCollectionButton";

interface SkinCardProps {
  skin: {
    id: number;
    slug: string;
    name: string;
    editionName?: string | null;
    limitedEdition?: boolean | null;
    material?: string | null;
    finish?: string | null;
    imageUrl?: string | null;
  };
  consoleVariantId: number;
  consoleId: number;
}

export default function SkinCard({ skin, consoleId, consoleVariantId }: SkinCardProps) {
  const t = useTranslations("ConsoleDetails");
  const imageUrl = skin.imageUrl;
  const hasValidImage = isValidUrl(imageUrl);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/skin/${skin.slug}`}>
        <div className="h-48 relative">
          {hasValidImage ? (
            <Image
              src={imageUrl!}
              alt={skin.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
              <span className="text-gray-500">{t("noImage")}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/skin/${skin.slug}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
            {skin.name}
          </h3>
        </Link>

        {skin.editionName && (
          <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
            {skin.editionName}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {skin.limitedEdition && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {t("limitedEdition")}
            </span>
          )}

          {skin.material && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {skin.material}
            </span>
          )}

          {skin.finish && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {skin.finish}
            </span>
          )}
        </div>

        <div className="mt-4">
          <AddToCollectionButton
            consoleId={consoleId}
            consoleVariantId={consoleVariantId}
            skinId={skin.id}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
