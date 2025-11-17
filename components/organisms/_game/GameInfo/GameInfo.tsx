// components/organisms/GameInfo/GameInfo.tsx
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import InfoItem from "@/components/atoms/InfoItem/InfoItem";
import { Card } from "@/components/atoms/Card/Card";
import { Gamepad } from "lucide-react";
import { Badge } from "@/components/atoms/Badge/Badge";
import { PlatformIcons } from "@/components/molecules/RenderPlatformIcons/RenderPlatformIcons";
import TruncatedText from "@/components/atoms/TruncatedText/TruncatedText";
import { GameWithStats } from "@/@types/catalog.types";

interface GameInfoProps {
  game: GameWithStats;
}

export default function GameInfo({ game }: GameInfoProps) {
  const t = useTranslations("GameDetails");
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 w-full aspect-square relative">
          {imageError ? (
            <div className="absolute inset-0 bg-gray-200 border-2 border-dashed rounded-xl text-gray-400 flex items-center justify-center dark:bg-gray-700">
              <Gamepad size={40} className="mx-auto" />
              <span className="sr-only">{t("noImage")}</span>
            </div>
          ) : (
            <Image
              src={game.imageUrl || ""}
              alt={game.name}
              fill
              className="rounded-lg object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{game.name}</h1>

          {game.esrbRating && (
            <Badge status="info" className="mb-4">
              {game.esrbRating}
            </Badge>
          )}
          {game.parentPlatforms.length && <PlatformIcons platforms={game.parentPlatforms} />}

          {game.description && (
            <TruncatedText text={game.description} maxLength={150} className="mt-3" />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-3">
            <InfoItem
              label={t("releaseDate")}
              value={game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : "-"}
            />
            <InfoItem label={t("metacritic")} value={game.metacritic || "-"} />
            <InfoItem label={t("rating")} value={game.score || "-"} />
            <InfoItem label={t("year")} value={game.year || "-"} />
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">{t("relatedGames")}</h3>
            <div className="flex flex-wrap gap-2">
              {(game.series?.games?.length ?? 0) > 0 && (
                <Badge variant="soft">
                  {t("series")}: {game.series?.games?.length ?? 0}
                </Badge>
              )}
              {game.children && game.children.length > 0 && (
                <Badge variant="soft">
                  {t("dlcs")}: {game.children.length}
                </Badge>
              )}
              {game.parents && game.parents.length > 0 && (
                <Badge variant="soft">
                  {t("parents")}: {game.parents.length}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
