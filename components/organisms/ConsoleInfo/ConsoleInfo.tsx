// components/organisms/ConsoleInfo/ConsoleInfo.tsx
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { normalizeImageUrl } from "@/utils/validate-url";
import InfoItem from "@/components/atoms/InfoItem/InfoItem";
import { Card } from "@/components/atoms/Card/Card";
import { Gamepad } from "lucide-react";

interface ConsoleInfoProps {
  consoleVariant: {
    imageUrl?: string | null;
    consoleName: string;
    name: string;
    brand: { slug: string };
    generation?: number | null;
    type?: string | null;
    releaseDate?: string | null;
    storage?: string | null;
    launchDate?: string | null;
    consoleDescription?: string | null;
  };
}

export default function ConsoleInfo({ consoleVariant }: ConsoleInfoProps) {
  const t = useTranslations("ConsoleDetails");
  const imageUrl = consoleVariant.imageUrl;
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 w-full aspect-[4/3] relative">
          {imageError ? (
            <div className="absolute inset-0 bg-gray-200 border-2 border-dashed rounded-xl text-gray-400 flex items-center justify-center dark:bg-gray-700">
              <Gamepad size={40} className="mx-auto" />
              <span className="sr-only">{t("noImage")}</span>
            </div>
          ) : (
            <Image
              src={normalizeImageUrl(imageUrl!)}
              alt={`${consoleVariant.consoleName} ${consoleVariant.name}`}
              fill
              className="rounded-lg object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 33vw (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">
            {consoleVariant.consoleName} {consoleVariant.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoItem label={t("brand")} value={consoleVariant.brand.slug} />
            <InfoItem label={t("generation")} value={consoleVariant.generation} />
            <InfoItem label={t("type")} value={consoleVariant.type} />
            <InfoItem
              label={t("releaseDate")}
              value={
                consoleVariant.releaseDate
                  ? new Date(consoleVariant.releaseDate).toLocaleDateString()
                  : "-"
              }
            />
            <InfoItem label={t("storage")} value={consoleVariant.storage} />
            {consoleVariant.launchDate !== consoleVariant.releaseDate && (
              <InfoItem
                label={t("launchDate")}
                value={
                  consoleVariant.launchDate
                    ? new Date(consoleVariant.launchDate).toLocaleDateString()
                    : "-"
                }
              />
            )}
          </div>

          {consoleVariant.consoleDescription && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">{t("description")}</h3>
              <p>{consoleVariant.consoleDescription}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
