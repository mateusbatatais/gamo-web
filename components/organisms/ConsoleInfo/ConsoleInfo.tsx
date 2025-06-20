// components/organisms/ConsoleInfo/ConsoleInfo.tsx
import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { isValidUrl } from "@/utils/validate-url";
import InfoItem from "@/components/atoms/InfoItem/InfoItem";

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

  // Valida a URL da imagem
  const imageUrl = consoleVariant.imageUrl;
  const hasValidImage = isValidUrl(imageUrl);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          {hasValidImage ? (
            <Image
              src={imageUrl!}
              alt={`${consoleVariant.consoleName} ${consoleVariant.name}`}
              width={400}
              height={300}
              className="rounded-lg object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
              <span className="text-gray-500">{t("noImage")}</span>
            </div>
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
            <InfoItem
              label={t("launchDate")}
              value={
                consoleVariant.launchDate
                  ? new Date(consoleVariant.launchDate).toLocaleDateString()
                  : "-"
              }
            />
          </div>

          {consoleVariant.consoleDescription && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">{t("description")}</h3>
              <p>{consoleVariant.consoleDescription}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
