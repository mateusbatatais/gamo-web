// components/organisms/PublicProfile/PublicKitDetailModal/PublicKitDetailModal.tsx
"use client";

import React from "react";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { UserKit } from "@/@types/collection.types";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import Link from "next/link";
import { Package, MapPin } from "lucide-react";
import { WhatsAppButton } from "@/components/atoms/WhatsAppButton/WhatsAppButton";

interface PublicKitDetailModalProps {
  kit: UserKit;
  isOpen: boolean;
  onClose: () => void;
  sellerPhone?: string;
}

export const PublicKitDetailModal = ({
  kit,
  isOpen,
  onClose,
  sellerPhone,
}: PublicKitDetailModalProps) => {
  const t = useTranslations("PublicProfile");
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(kit.photoMain);

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(kit.price);

  const formattedDate = kit.createdAt ? new Date(kit.createdAt).toLocaleDateString("pt-BR") : null;

  return (
    <Dialog open={isOpen} onClose={onClose} title={kit.name} size="lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image - Only show if photoMain exists */}
          {kit.photoMain && (
            <div className="relative w-full md:w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
              <SafeImage
                src={safeImageUrl}
                alt={kit.name}
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-cover"
                priority={true}
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="flex-1">
            {/* Sale Information */}
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formattedPrice}
                </span>
              </div>

              {(kit.city || kit.state) && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                  <MapPin size={16} />
                  <span>
                    {kit.city}
                    {kit.city && kit.state && ", "}
                    {kit.state}
                  </span>
                </div>
              )}

              {formattedDate && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t("listedOn")} {formattedDate}
                </div>
              )}

              {sellerPhone && (
                <div className="pt-2">
                  <WhatsAppButton phone={sellerPhone} />
                </div>
              )}
            </div>

            {kit.description && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 dark:text-white">{t("description")}</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {kit.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Kit Items */}
        <div className="space-y-6">
          {/* Games */}
          {kit.items.games.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
                {t("gamesLabel")} ({kit.items.games.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {kit.items.games.map((game) => (
                  <Link
                    key={game.id}
                    href={`/game/${game.gameSlug}`}
                    target="_blank"
                    className="group bg-gray-50 dark:bg-gray-800 rounded-lg p-2 hover:shadow-md transition-all"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                        {game.gameImageUrl ? (
                          <SafeImage
                            src={game.gameImageUrl}
                            alt={game.gameTitle || "Game"}
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium dark:text-white truncate group-hover:text-primary-500 transition-colors">
                          {game.gameTitle}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge status={game.media === "PHYSICAL" ? "info" : "success"} size="sm">
                            {game.media === "PHYSICAL" ? "Físico" : "Digital"}
                          </Badge>
                          {game.condition && (
                            <Badge status="default" size="sm">
                              {game.condition}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Consoles */}
          {kit.items.consoles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
                {t("consolesLabel")} ({kit.items.consoles.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {kit.items.consoles.map((console) => (
                  <Link
                    key={console.id}
                    href={`/console/${console.variantSlug}`}
                    target="_blank"
                    className="group bg-gray-50 dark:bg-gray-800 rounded-lg p-2 hover:shadow-md transition-all"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                        {console.photoMain ? (
                          <SafeImage
                            src={getSafeImageUrl(console.photoMain)}
                            alt={console.consoleName || "Console"}
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium dark:text-white truncate group-hover:text-primary-500 transition-colors">
                          {console.consoleName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {console.variantName}
                        </p>
                        {console.condition && (
                          <div className="mt-1">
                            <Badge status="default" size="sm">
                              {console.condition}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Accessories */}
          {kit.items.accessories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
                {t("accessoriesLabel")} ({kit.items.accessories.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {kit.items.accessories.map((accessory) => (
                  <Link
                    key={accessory.id}
                    href={`/accessory/${accessory.accessorySlug}`}
                    target="_blank"
                    className="group bg-gray-50 dark:bg-gray-800 rounded-lg p-2 hover:shadow-md transition-all"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                        {accessory.photoMain ? (
                          <SafeImage
                            src={getSafeImageUrl(accessory.photoMain)}
                            alt={accessory.accessoryName || "Accessory"}
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium dark:text-white truncate group-hover:text-primary-500 transition-colors">
                          {accessory.accessoryName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {accessory.variantName}
                        </p>
                        {accessory.condition && (
                          <div className="mt-1">
                            <Badge status="default" size="sm">
                              {accessory.condition}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Photos */}
        {kit.photos && kit.photos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">{t("additionalPhotos")}</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {kit.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  <SafeImage
                    src={getSafeImageUrl(photo)}
                    alt={`${kit.name} - Foto ${index + 1}`}
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
