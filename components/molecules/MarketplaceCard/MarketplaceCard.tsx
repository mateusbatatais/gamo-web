import React, { useState, useRef, useEffect } from "react";
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
import { Badge } from "@/components/atoms/Badge/Badge";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MarketplaceCardProps {
  item: MarketplaceItem;
  viewMode?: "grid" | "list";
}

export default function MarketplaceCard({ item, viewMode = "grid" }: MarketplaceCardProps) {
  const t = useTranslations("ConsoleDetails");
  const { getSafeImageUrl } = useSafeImageUrl();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const safeImageUrl = getSafeImageUrl(item.photoMain || item.imageUrl);

  useEffect(() => {
    if (descriptionRef.current && !isExpanded) {
      setShowToggle(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight);
    }
  }, [item.description, isExpanded]);

  const formattedPrice = item.price
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.price)
    : null;

  const formattedDate = new Date(item.createdAt).toLocaleDateString("pt-BR");

  const tradeType = item.status === "SELLING" ? "selling" : "looking";

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case "NEW":
        return "Novo";
      case "USED":
        return "Usado";
      case "REFURBISHED":
        return "Recondicionado";
      default:
        return condition;
    }
  };

  let itemLink = `/user/${item.seller.slug}/market?tradetype=${tradeType}`;
  if (item.itemType === "CONSOLE") {
    itemLink += `&console=${item.id}`;
  } else if (item.itemType === "GAME") {
    itemLink += `&game=${item.id}`;
  } else if (item.itemType === "ACCESSORY") {
    itemLink += `&accessory=${item.id}`;
  } else if (item.itemType === "KIT") {
    itemLink += `&kit=${item.id}`;
  }

  const isList = viewMode === "list";

  return (
    <Card
      className={clsx(
        "overflow-hidden hover:shadow-lg transition-all duration-300 p-0! h-full flex group",
        isList ? "flex-row h-auto min-h-[140px] sm:min-h-[200px]" : "flex-col",
      )}
    >
      <Link
        href={itemLink}
        className={clsx(
          "block relative bg-gray-100 dark:bg-gray-800 cursor-pointer overflow-hidden",
          isList ? "w-32 sm:w-48 shrink-0" : "h-48 w-full",
        )}
        target="_blank"
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

        {item.itemType === "KIT" && !item.photoMain && item.photos && item.photos.length > 0 ? (
          <div
            className={`grid h-full w-full ${
              item.photos.length === 1
                ? "grid-cols-1"
                : item.photos.length === 2
                  ? "grid-cols-2"
                  : item.photos.length === 3
                    ? "grid-cols-2 grid-rows-2"
                    : "grid-cols-3 grid-rows-2"
            }`}
          >
            {item.photos.slice(0, 5).map((img, index) => (
              <div
                key={index}
                className={`relative overflow-hidden border-white dark:border-gray-800 ${
                  item.photos.length === 3 && index === 0
                    ? "row-span-2"
                    : item.photos.length >= 4 && index === 0
                      ? "col-span-2 row-span-2"
                      : ""
                } ${index > 0 ? "border-l border-t" : ""}`}
              >
                <SafeImage
                  src={getSafeImageUrl(img)}
                  alt={`${item.name} item ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <SafeImage
            src={safeImageUrl}
            alt={item.name}
            fill
            sizes={
              isList
                ? "(max-width: 640px) 128px, 192px"
                : "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            }
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        )}
      </Link>

      <div className={clsx("flex-1 flex flex-col", isList ? "p-3 sm:p-4" : "p-4")}>
        <Link href={itemLink} className="group-hover:text-primary-600 transition-colors">
          <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2">{item.name}</h3>
        </Link>
        {item.subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.subtitle}</p>
        )}

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
          hasBox={item.hasBox}
          hasManual={item.hasManual}
          gamesCount={item.gamesCount || item.kitInfo?.gamesCount}
          accessoriesCount={item.accessoriesCount || item.kitInfo?.accessoriesCount}
          consolesCount={item.kitInfo?.consolesCount}
          className="mb-3"
        />

        {item.description && (
          <div className="mb-3">
            <p
              ref={descriptionRef}
              className={clsx(
                "text-sm text-gray-600 dark:text-gray-400 transition-all duration-300",
                isExpanded ? "" : "line-clamp-2",
              )}
            >
              {item.description}
            </p>
            {showToggle && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(!isExpanded);
                }}
                className="text-xs text-primary-600 dark:text-primary-400 mt-1 flex items-center gap-1 hover:underline focus:outline-none"
              >
                {isExpanded ? (
                  <>
                    {t("showLess")} <ChevronUp size={12} />
                  </>
                ) : (
                  <>
                    {t("showMore")} <ChevronDown size={12} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {item.condition && (
          <div className="mb-4">
            <Badge variant="soft" status="info" className="text-xs">
              {getConditionLabel(item.condition)}
            </Badge>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 items-center justify-between text-xs text-gray-500">
          <Link
            href={`/user/${item.seller.slug}`}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors min-w-0"
          >
            <User size={16} />
            <span className="truncate font-medium">{item.seller.name}</span>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
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
