// components/molecules/AccessoryVariantCard/AccessoryVariantCard.tsx
import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { normalizeImageUrl } from "@/utils/validate-url";
import { Card } from "@/components/atoms/Card/Card";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Package } from "lucide-react";
import { AccessoryVariantDetail } from "@/@types/catalog.types";
import { AddAccessoryToCollection } from "../AddAccessoryToCollection/AddAccessoryToCollection";
import { useFavorite } from "@/hooks/useFavorite";
import clsx from "clsx";

interface AccessoryVariantCardProps {
  variant: AccessoryVariantDetail;
  accessoryId: number;
}

const useAddToCollectionFeedback = () => {
  const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);

  const triggerFeedback = (variantId: number) => {
    setRecentlyAdded(variantId);
    setTimeout(() => setRecentlyAdded(null), 2000);
  };

  return { recentlyAdded, triggerFeedback };
};

export default function AccessoryVariantCard({ variant, accessoryId }: AccessoryVariantCardProps) {
  const t = useTranslations("AccessoryDetails");
  const imageUrl = variant.imageUrl;
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { recentlyAdded, triggerFeedback } = useAddToCollectionFeedback();
  const { toggleFavorite } = useFavorite();

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 !p-0 ${
        recentlyAdded === variant.id ? "ring-2 ring-green-500 scale-[1.02] shadow-xl" : ""
      }`}
    >
      <div className="h-48 relative">
        {imageError ? (
          <div className="bg-gray-200 rounded-top-xl border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center dark:bg-gray-700 dark:border-gray-600">
            <Package size={40} className="mx-auto" />
            <span className="sr-only">{t("noImage")}</span>
          </div>
        ) : (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center rounded-t-lg">
                <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin" />
              </div>
            )}
            <Image
              src={normalizeImageUrl(imageUrl!)}
              alt={variant.name}
              fill
              className={clsx(
                "object-cover transition-opacity duration-500",
                isImageLoading ? "opacity-0" : "opacity-100",
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setIsImageLoading(false)}
              onError={() => setImageError(true)}
              priority={true}
            />
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
          {variant.name}
        </h3>

        {variant.editionName && (
          <Badge status="primary" className="mb-2">
            {variant.editionName}
          </Badge>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {variant.limitedEdition && <Badge status="danger">{t("limitedEdition")}</Badge>}

          {variant.material && <Badge variant="soft">{variant.material}</Badge>}

          {variant.finish && <Badge variant="soft">{variant.finish}</Badge>}
        </div>

        {variant.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{variant.description}</p>
        )}

        <div className="mt-4">
          <AddAccessoryToCollection
            accessoryId={accessoryId}
            accessoryVariantId={variant.id}
            accessorySlug={variant.slug}
            onAddSuccess={() => triggerFeedback(variant.id)}
            isFavorite={false} // Default to false as state is not available here
            onFavoriteToggle={() => toggleFavorite({ itemId: accessoryId, itemType: "ACCESSORY" })}
          />
        </div>
      </div>
    </Card>
  );
}
