// components/organisms/PublicProfile/PublicConsoleDetailModal/PublicConsoleDetailModal.tsx
"use client";

import React from "react";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { UserConsole } from "@/@types/collection.types";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import Link from "next/link";
import { ArrowLeftRight, MapPin, Package } from "lucide-react";
import { ItemBadges } from "@/components/molecules/ItemBadges/ItemBadges";

interface PublicConsoleDetailModalProps {
  consoleItem: UserConsole;
  isOpen: boolean;
  onClose: () => void;
}

export const PublicConsoleDetailModal = ({
  consoleItem,
  isOpen,
  onClose,
}: PublicConsoleDetailModalProps) => {
  const t = useTranslations("PublicProfile");
  const tConsole = useTranslations("ConsoleDetails");
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(consoleItem.photoMain);

  const showSaleInfo = consoleItem.status === "SELLING" || consoleItem.status === "LOOKING_FOR";

  const formattedPrice = consoleItem.price
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(consoleItem.price)
    : null;

  return (
    <Dialog open={isOpen} onClose={onClose} title={t("consoleDetails")} size="lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="relative w-full md:w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
            <SafeImage
              src={safeImageUrl}
              alt={`${consoleItem.consoleName} ${consoleItem.variantName}`}
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
              priority={true}
            />
            {consoleItem.acceptsTrade && (
              <div className="absolute top-2 left-2 bg-amber-500 text-white p-1.5 rounded-full shadow-sm">
                <ArrowLeftRight size={16} />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <Link href={`/console/${consoleItem.variantSlug}`} target="_blank">
              <h2 className="text-2xl font-bold dark:text-white hover:text-primary-500 transition-colors">
                {consoleItem.consoleName} - {consoleItem.variantName}
              </h2>
            </Link>

            {consoleItem.skinName && (
              <p className="mt-2 text-sm dark:text-gray-400">
                <span className="font-medium dark:text-gray-300">{t("skin")}:</span>{" "}
                {consoleItem.skinName}
              </p>
            )}

            {/* Sale Information (Integrated) */}
            {showSaleInfo && (
              <div className="mt-2  bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                {formattedPrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      {formattedPrice}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <ItemBadges
                    hasBox={consoleItem.hasBox || false}
                    hasManual={consoleItem.hasManual || false}
                  />
                </div>

                {consoleItem.acceptsTrade && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                    <ArrowLeftRight size={14} />
                    <span className="font-medium">{tConsole("acceptsTrade")}</span>
                  </div>
                )}

                {(consoleItem.city || consoleItem.state) && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <MapPin size={14} />
                    <span>
                      {consoleItem.city}
                      {consoleItem.city && consoleItem.state && ", "}
                      {consoleItem.state}
                    </span>
                  </div>
                )}
              </div>
            )}

            {consoleItem.description && (
              <p className="mt-4 text-gray-700 dark:text-gray-300">{consoleItem.description}</p>
            )}

            {consoleItem.status === "PREVIOUSLY_OWNED" && (
              <Badge status="warning" size="md" className="mt-4">
                {t("previouslyOwned")}
              </Badge>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="text-lg font-semibold mb-3 dark:text-white">{t("specifications")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {consoleItem.brand && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">{tConsole("brand")}</p>
                <p className="font-medium dark:text-white capitalize">{consoleItem.brand}</p>
              </div>
            )}
            {consoleItem.generation && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">{tConsole("generation")}</p>
                <p className="font-medium dark:text-white">{consoleItem.generation}ª Geração</p>
              </div>
            )}
            {consoleItem.type && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">{tConsole("type")}</p>
                <p className="font-medium dark:text-white capitalize">{consoleItem.type}</p>
              </div>
            )}
            {consoleItem.storageOption && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">{tConsole("storage")}</p>
                <p className="font-medium dark:text-white">
                  {consoleItem.storageOption.value} {consoleItem.storageOption.unit}
                  {consoleItem.storageOption.note && ` (${consoleItem.storageOption.note})`}
                </p>
              </div>
            )}
            {consoleItem.mediaFormats && consoleItem.mediaFormats.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tConsole("mediaFormats")}
                </p>
                <p className="font-medium dark:text-white capitalize">
                  {consoleItem.mediaFormats.join(", ")}
                </p>
              </div>
            )}
            {consoleItem.retroCompatible !== undefined && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tConsole("retroCompatible")}
                </p>
                <p className="font-medium dark:text-white">
                  {consoleItem.retroCompatible ? "Sim" : "Não"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Associated Games */}
        {consoleItem.games && consoleItem.games.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">
              {t("associatedGames")} ({consoleItem.games.length})
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto">
              {consoleItem.games.map((game) => (
                <Link
                  key={game.id}
                  href={`/game/${game.gameSlug}`}
                  target="_blank"
                  className="group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {game.gameImageUrl ? (
                      <SafeImage
                        src={game.gameImageUrl}
                        alt={game.gameTitle || "Console"}
                        sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package size={24} />
                      </div>
                    )}
                    {/* Media type badge */}
                    <div className="absolute top-1 right-1">
                      <Badge status={game.media === "PHYSICAL" ? "info" : "success"} size="sm">
                        {game.media === "PHYSICAL" ? "Físico" : "Digital"}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs font-medium dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
                    {game.gameTitle}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Associated Accessories */}
        {consoleItem.accessories && consoleItem.accessories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">
              {t("associatedAccessories")} ({consoleItem.accessories.length})
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {consoleItem.accessories.map((accessory) => (
                <Link
                  key={accessory.id}
                  href={`/accessory/${accessory.accessorySlug}`}
                  target="_blank"
                  className="group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {accessory.photoMain ? (
                      <SafeImage
                        src={getSafeImageUrl(accessory.photoMain)}
                        alt={accessory.accessoryName || "Accessory"}
                        sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package size={24} />
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs font-medium dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
                    {accessory.accessoryName}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Additional Photos */}
        {consoleItem.photos && consoleItem.photos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">
              {tConsole("additionalPhotos")}
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {consoleItem.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  <SafeImage
                    src={getSafeImageUrl(photo)}
                    alt={`${consoleItem.consoleName} - Foto ${index + 1}`}
                    sizes="(max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
