// components/organisms/PublicProfile/PublicProfileConsoleCard/PublicProfileConsoleCard.tsx
import React from "react";
import Image from "next/image";
import { Badge, BadgeStatus } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { ConsoleStatus, UserConsolePublic } from "@/@types/publicProfile";
import { Card } from "@/components/atoms/Card/Card";

export const PublicProfileConsoleCard = ({
  consoleItem,
}: {
  consoleItem: UserConsolePublic & { status: ConsoleStatus["Status"] };
}) => {
  const t = useTranslations("PublicProfile");

  const statusVariantMap: Record<ConsoleStatus["Status"], BadgeStatus> = {
    PUBLISHED: "info",
    SELLING: "success",
    SOLD: "warning",
    ARCHIVED: "danger",
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow !p-0 relative">
      <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
        {consoleItem.photoMain ? (
          <Image
            src={consoleItem.photoMain}
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
            <h3 className="font-semibold text-lg dark:text-white">{consoleItem.consoleName}</h3>
            <p className="text-gray-600 dark:text-gray-300">{consoleItem.variantName}</p>
          </div>
          <div className="absolute top-4 right-4">
            <Badge status={statusVariantMap[consoleItem.status as ConsoleStatus["Status"]]}>
              {t(`status.${consoleItem.status.toLowerCase()}`)}
            </Badge>
          </div>
        </div>

        {consoleItem.skinName && (
          <p className="mt-2 text-sm dark:text-gray-400">
            <span className="font-medium dark:text-gray-300">{t("skin")}:</span>{" "}
            {consoleItem.skinName}
          </p>
        )}

        {consoleItem.price && (
          <p className="mt-2 font-bold dark:text-white">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "BRL",
            }).format(consoleItem.price)}
          </p>
        )}

        <div className="mt-3 flex gap-2 flex-wrap">
          {consoleItem.hasBox && (
            <Badge status="info" size="sm">
              {t("withBox")}
            </Badge>
          )}

          {consoleItem.hasManual && (
            <Badge status="success" size="sm">
              {t("withManual")}
            </Badge>
          )}

          {consoleItem.acceptsTrade && (
            <Badge status="warning" size="sm">
              {t("acceptsTrade")}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
