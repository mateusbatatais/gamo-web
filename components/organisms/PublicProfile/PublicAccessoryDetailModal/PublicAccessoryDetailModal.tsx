// components/organisms/PublicProfile/PublicAccessoryDetailModal/PublicAccessoryDetailModal.tsx
"use client";

import React from "react";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { UserAccessory } from "@/@types/collection.types";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import Link from "next/link";
import { ArrowLeftRight, MapPin } from "lucide-react";
import { ItemBadges } from "@/components/molecules/ItemBadges/ItemBadges";

interface PublicAccessoryDetailModalProps {
  accessoryItem: UserAccessory;
  isOpen: boolean;
  onClose: () => void;
}

export const PublicAccessoryDetailModal = ({
  accessoryItem,
  isOpen,
  onClose,
}: PublicAccessoryDetailModalProps) => {
  const t = useTranslations("PublicProfile");
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(accessoryItem.photoMain);

  const showSaleInfo = accessoryItem.status === "SELLING" || accessoryItem.status === "LOOKING_FOR";

  const formattedPrice = accessoryItem.price
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(accessoryItem.price)
    : null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={accessoryItem.accessoryName || "Acessório"}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="relative w-full md:w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
            <SafeImage
              src={safeImageUrl}
              alt={accessoryItem.accessoryName || "Acessório"}
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
              priority={true}
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <Link href={`/accessory/${accessoryItem.accessorySlug}`} target="_blank">
              <h2 className="text-2xl font-bold dark:text-white hover:text-primary-500 transition-colors">
                {accessoryItem.accessoryName}
              </h2>
            </Link>

            {accessoryItem.variantName && (
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                {accessoryItem.variantName}
              </p>
            )}

            {accessoryItem.type && (
              <p className="mt-1 text-gray-600 dark:text-gray-400 capitalize">
                {accessoryItem.type}
                {accessoryItem.subType && ` - ${accessoryItem.subType}`}
              </p>
            )}

            {/* Sale Information (Integrated) */}
            {showSaleInfo && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                {formattedPrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      {formattedPrice}
                    </span>
                  </div>
                )}

                {accessoryItem.condition && (
                  <Badge
                    variant="soft"
                    status={
                      accessoryItem.condition === "NEW"
                        ? "success"
                        : accessoryItem.condition === "USED"
                          ? "warning"
                          : "default"
                    }
                  >
                    {t(`condition.${accessoryItem.condition}`)}
                  </Badge>
                )}

                <div className="flex flex-wrap gap-2">
                  <ItemBadges
                    hasBox={accessoryItem.hasBox || false}
                    hasManual={accessoryItem.hasManual || false}
                  />
                </div>

                {accessoryItem.acceptsTrade && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                    <ArrowLeftRight size={14} />
                    <span className="font-medium">Aceita trocas</span>
                  </div>
                )}

                {(accessoryItem.city || accessoryItem.state) && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <MapPin size={14} />
                    <span>
                      {accessoryItem.city}
                      {accessoryItem.city && accessoryItem.state && ", "}
                      {accessoryItem.state}
                    </span>
                  </div>
                )}
              </div>
            )}

            {accessoryItem.description && (
              <p className="mt-4 text-gray-700 dark:text-gray-300">{accessoryItem.description}</p>
            )}

            {accessoryItem.status === "PREVIOUSLY_OWNED" && (
              <Badge status="warning" size="md" className="mt-4">
                {t("previouslyOwned")}
              </Badge>
            )}
          </div>
        </div>

        {/* Additional Photos */}
        {accessoryItem.photos && accessoryItem.photos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Fotos adicionais</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {accessoryItem.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  <SafeImage
                    src={getSafeImageUrl(photo)}
                    alt={`${accessoryItem.accessoryName} - Foto ${index + 1}`}
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
