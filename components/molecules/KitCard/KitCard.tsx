import React from "react";
import Link from "next/link";
import { UserKit } from "@/@types/collection.types";
import { Card } from "@/components/atoms/Card/Card";
import { Package, Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { Button } from "@/components/atoms/Button/Button";

interface KitCardProps {
  kit: UserKit;
  isOwner?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
  priority?: boolean;
}

export const KitCard = ({
  kit,
  isOwner,
  onEdit,
  onDelete,
  isDeleting,
  priority = false,
}: KitCardProps) => {
  const t = useTranslations("PublicProfile");
  const { getSafeImageUrl } = useSafeImageUrl();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getImages = () => {
    if (kit.photoMain) {
      return [kit.photoMain];
    }

    const allItems = [
      ...(kit.items?.games || []),
      ...(kit.items?.consoles || []),
      ...(kit.items?.accessories || []),
    ];

    return allItems
      .map((item) => {
        if ("gameImageUrl" in item && item.gameImageUrl) return item.gameImageUrl;
        if ("photoMain" in item && item.photoMain) return item.photoMain;
        if ((item as { image?: string }).image) return (item as { image?: string }).image;
        return null;
      })
      .slice(0, 5);
  };

  const images = getImages();
  const hasMainImage = !!kit.photoMain;
  const displayImages = hasMainImage ? [images[0]] : images.slice(0, 5);

  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2 grid-rows-2";
    return "grid-cols-3 grid-rows-2";
  };

  const getItemClass = (count: number, index: number) => {
    let classes =
      "relative overflow-hidden border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700";

    if (count === 3 && index === 0) {
      classes += " row-span-2";
    } else if (count >= 4 && index === 0) {
      classes += " col-span-2 row-span-2";
    }

    if (index > 0) {
      classes += " border-l border-t";
    }

    return classes;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 p-0! h-full flex flex-col group">
      <Link
        href={`?kit=${kit.id}`}
        className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden block cursor-pointer"
        scroll={false}
      >
        {displayImages.length > 0 ? (
          hasMainImage ? (
            <SafeImage
              src={getSafeImageUrl(displayImages[0])}
              alt={kit.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className={`grid h-full w-full ${getGridClass(displayImages.length)}`}>
              {displayImages.map((img, index) => (
                <div key={index} className={getItemClass(displayImages.length, index)}>
                  {img ? (
                    <SafeImage
                      src={getSafeImageUrl(img)}
                      alt={`${kit.name} item ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={priority && index === 0}
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Package size={48} />
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {kit.name}
          </h3>
          <div className="text-lg font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap ml-2">
            {formatCurrency(kit.price)}
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {kit.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
            {kit.items.games.length > 0 && (
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {kit.items.games.length} {t("gamesLabel")}
              </span>
            )}
            {kit.items.consoles.length > 0 && (
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {kit.items.consoles.length} {t("consolesLabel")}
              </span>
            )}
            {kit.items.accessories.length > 0 && (
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {kit.items.accessories.length} {t("accessoriesLabel")}
              </span>
            )}
          </div>
        </div>

        {isOwner && (
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <Button
              variant="transparent"
              size="sm"
              onClick={() => onEdit?.(kit.id)}
              icon={<Edit size={16} />}
              className="text-gray-500 hover:text-primary-600"
            />
            <Button
              variant="transparent"
              size="sm"
              onClick={() => onDelete?.(kit.id)}
              icon={<Trash2 size={16} />}
              className="text-gray-500 hover:text-red-600"
              loading={isDeleting}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
