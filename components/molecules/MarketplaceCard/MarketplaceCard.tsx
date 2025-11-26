import React from "react";
import Link from "next/link";
import { MarketplaceItem } from "@/@types/catalog.types";
import { Card } from "@/components/atoms/Card/Card";
import { User, ArrowLeftRight, MapPin } from "lucide-react";

import { useTranslations } from "next-intl";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import clsx from "clsx";
import { ItemBadges } from "../ItemBadges/ItemBadges";
import { WhatsAppButton } from "@/components/atoms/WhatsAppButton/WhatsAppButton";

interface MarketplaceCardProps {
  item: MarketplaceItem;
  viewMode?: "grid" | "list";
}

export default function MarketplaceCard({ item, viewMode = "grid" }: MarketplaceCardProps) {
  const t = useTranslations("ConsoleDetails");
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(item.photoMain || item.imageUrl);

  const formattedPrice = item.price
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.price)
    : null;

  const formattedDate = new Date(item.createdAt).toLocaleDateString("pt-BR");

  const tradeType = item.status === "SELLING" ? "selling" : "looking";

  const isList = viewMode === "list";

  return (
    <Card
      className={clsx(
        "overflow-hidden hover:shadow-lg transition-all duration-300 p-0! h-full flex group",
        isList ? "flex-row h-auto min-h-[200px]" : "flex-col",
      )}
    >
      <Link
        href={`/user/${item.seller.slug}/market?tradetype=${tradeType}`}
        className={clsx(
          "block relative bg-gray-100 dark:bg-gray-800 cursor-pointer overflow-hidden",
          isList ? "w-48 shrink-0" : "h-48 w-full",
        )}
      >
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2 items-start">
          {item.acceptsTrade && (
            <div
              className="bg-amber-500 text-white p-1.5 rounded-full shadow-sm"
              aria-label={t("acceptsTrade")}
              title={t("acceptsTrade")}
            >
              <ArrowLeftRight size={16} />
            </div>
          )}
        </div>

        <SafeImage
          src={safeImageUrl}
          alt={item.name}
          fill
          sizes={
            isList
              ? "(max-width: 768px) 192px, 192px"
              : "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          }
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>

        {formattedPrice && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {formattedPrice}
            </span>
          </div>
        )}

        {(item.city || item.state) && (
          <div className="flex items-center gap-1 mb-3 text-sm text-gray-600 dark:text-gray-300">
            <MapPin size={14} />
            <span className="truncate">
              {item.city}
              {item.city && item.state && ", "}
              {item.state}
            </span>
          </div>
        )}

        <ItemBadges
          condition={item.condition}
          hasBox={item.hasBox}
          hasManual={item.hasManual}
          className="mb-4"
        />

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
          <Link
            href={`/user/${item.seller.slug}`}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
          >
            <User size={16} />
            <span className="truncate font-medium">{item.seller.name}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400" title={`Criado em ${formattedDate}`}>
              {formattedDate}
            </span>

            {item.seller.phone && <WhatsAppButton phone={item.seller.phone} />}
          </div>
        </div>
      </div>
    </Card>
  );
}
