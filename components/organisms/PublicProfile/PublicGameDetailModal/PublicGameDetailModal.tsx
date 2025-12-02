// components/organisms/PublicProfile/PublicGameDetailModal/PublicGameDetailModal.tsx
"use client";

import React from "react";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { UserGame } from "@/@types/collection.types";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { ItemBadges } from "@/components/molecules/ItemBadges/ItemBadges";
import { usePlatformsCache } from "@/hooks/usePlatformsCache";

interface PublicGameDetailModalProps {
  gameItem: UserGame;
  isOpen: boolean;
  onClose: () => void;
}

export const PublicGameDetailModal = ({
  gameItem,
  isOpen,
  onClose,
}: PublicGameDetailModalProps) => {
  const t = useTranslations("PublicProfile");
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(gameItem.photoMain);
  const { platformsMap } = usePlatformsCache();

  const showSaleInfo = gameItem.status === "SELLING" || gameItem.status === "LOOKING_FOR";

  const formattedPrice = gameItem.price
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(gameItem.price)
    : null;

  return (
    <Dialog open={isOpen} onClose={onClose} title={gameItem.gameTitle || "Game"} size="lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="relative w-full md:w-64 h-80 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
            <SafeImage
              src={safeImageUrl || gameItem.gameImageUrl}
              alt={gameItem.gameTitle || "Game"}
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
              priority={true}
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <Link href={`/game/${gameItem.gameSlug}`} target="_blank">
              <h2 className="text-2xl font-bold dark:text-white hover:text-primary-500 transition-colors">
                {gameItem.gameTitle}
                {gameItem.platformId && platformsMap[gameItem.platformId] && (
                  <span className="font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    - {platformsMap[gameItem.platformId]}
                  </span>
                )}
              </h2>
            </Link>

            {/* Media Type */}
            <div className="mt-3">
              <Badge status={gameItem.media === "PHYSICAL" ? "info" : "success"} size="md">
                {gameItem.media === "PHYSICAL" ? "Físico" : "Digital"}
              </Badge>
            </div>

            {/* Rating & Progress */}
            <div className="mt-4 space-y-3">
              {gameItem.rating !== null && gameItem.rating !== undefined && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t("rating")}</p>
                  <div className="flex items-center gap-2">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < (gameItem.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }
                      />
                    ))}
                    <span className="text-sm font-medium dark:text-white">
                      {gameItem.rating}/10
                    </span>
                  </div>
                </div>
              )}

              {gameItem.progress !== null && gameItem.progress !== undefined && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t("progress")}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${(gameItem.progress || 0) * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium dark:text-white">
                      {gameItem.progress}/10
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Sale Information (Integrated) */}
            {showSaleInfo && (
              <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                {formattedPrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      {formattedPrice}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <ItemBadges
                    hasBox={gameItem.hasBox || false}
                    hasManual={gameItem.hasManual || false}
                  />
                </div>

                {gameItem.acceptsTrade && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                    <span className="font-medium">Aceita trocas</span>
                  </div>
                )}

                {(gameItem.city || gameItem.state) && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <MapPin size={14} />
                    <span>
                      {gameItem.city}
                      {gameItem.city && gameItem.state && ", "}
                      {gameItem.state}
                    </span>
                  </div>
                )}
              </div>
            )}

            {gameItem.description && (
              <p className="mt-4 text-gray-700 dark:text-gray-300">{gameItem.description}</p>
            )}

            {gameItem.status === "PREVIOUSLY_OWNED" && (
              <Badge status="warning" size="md" className="mt-4">
                {t("previouslyOwned")}
              </Badge>
            )}
          </div>
        </div>

        {/* Review */}
        {gameItem.review && (
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Análise</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {gameItem.review}
              </p>
            </div>
          </div>
        )}

        {/* Additional Photos */}
        {gameItem.photos && gameItem.photos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Fotos adicionais</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {gameItem.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  <SafeImage
                    src={getSafeImageUrl(photo)}
                    alt={`${gameItem.gameTitle} - Foto ${index + 1}`}
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
