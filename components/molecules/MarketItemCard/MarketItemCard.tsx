import React from "react";
import Link from "next/link";
import { MarketItem } from "@/@types/catalog.types";
import { Card } from "@/components/atoms/Card/Card";
import { User, Calendar, Box, FileText, ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/atoms/Badge/Badge";
import { useTranslations } from "next-intl";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { WhatsAppButton } from "@/components/atoms/WhatsAppButton/WhatsAppButton";

interface MarketItemCardProps {
  item: MarketItem;
}

export default function MarketItemCard({ item }: MarketItemCardProps) {
  const t = useTranslations("ConsoleDetails");
  const { getSafeImageUrl } = useSafeImageUrl();
  const safeImageUrl = getSafeImageUrl(item.image);

  const formattedPrice = item.price
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.price)
    : null;

  const formattedDate = new Date(item.createdAt).toLocaleDateString("pt-BR");

  const tradeType = item.status === "SELLING" ? "selling" : "looking";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 p-0! h-full flex flex-col">
      <Link
        href={`/user/${item.userSlug}/market?tradetype=${tradeType}`}
        className="block h-48 relative bg-gray-100 dark:bg-gray-800 cursor-pointer group"
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
          alt={`Item de ${item.userName}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />

        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
          {item.status === "SELLING" ? (
            <Badge variant="solid" status="success">
              {t("selling")}
            </Badge>
          ) : (
            <Badge variant="solid" status="warning">
              {t("looking")}
            </Badge>
          )}
          {item.condition && (
            <Badge variant="solid" status="info">
              {item.condition}
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        {formattedPrice && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {formattedPrice}
            </span>
          </div>
        )}

        <Link
          href={`/user/${item.userSlug}`}
          className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
        >
          <User size={16} />
          <span className="truncate font-medium">{item.userName}</span>
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {item.hasBox && (
            <Badge variant="soft" className="flex items-center gap-1">
              <Box size={12} /> {t("box")}
            </Badge>
          )}
          {item.hasManual && (
            <Badge variant="soft" className="flex items-center gap-1">
              <FileText size={12} /> {t("manual")}
            </Badge>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>

          {item.sellerPhone && <WhatsAppButton phone={item.sellerPhone} />}
        </div>
      </div>
    </Card>
  );
}
