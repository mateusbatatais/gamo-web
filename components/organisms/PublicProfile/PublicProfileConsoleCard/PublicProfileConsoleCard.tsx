// components/organisms/PublicProfile/PublicProfileConsoleCard.tsx
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { UserConsolePublic } from "@/@types/publicProfile";

export const PublicProfileConsoleCard = ({ consoleItem }: { consoleItem: UserConsolePublic }) => {
  const t = useTranslations("PublicProfile");

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {consoleItem.photoUrl ? (
          <Image
            src={consoleItem.photoUrl}
            alt={`${consoleItem.consoleName} ${consoleItem.variantName}`}
            fill
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🎮</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{consoleItem.consoleName}</h3>
            <p className="text-gray-600">{consoleItem.variantName}</p>
          </div>

          <Badge variant={consoleItem.status === "SELLING" ? "solid" : "soft"}>
            {t(`status.${consoleItem.status.toLowerCase()}`)}
          </Badge>
        </div>

        {consoleItem.skinName && (
          <p className="mt-2 text-sm">
            <span className="font-medium">{t("skin")}:</span> {consoleItem.skinName}
          </p>
        )}

        {consoleItem.price && (
          <p className="mt-2 font-bold">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "BRL",
            }).format(consoleItem.price)}
          </p>
        )}

        <div className="mt-3 flex gap-2 flex-wrap">
          {consoleItem.hasBox && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {t("withBox")}
            </span>
          )}

          {consoleItem.hasManual && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {t("withManual")}
            </span>
          )}

          {consoleItem.acceptsTrade && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {t("acceptsTrade")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
