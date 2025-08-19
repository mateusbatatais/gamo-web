import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Star, Calendar } from "lucide-react";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Gamepad } from "lucide-react";
import { PlatformIcons } from "../../RenderPlatformIcons/RenderPlatformIcons";
import { AddGameToCollection } from "../AddGameToCollection/AddGameToCollection";
import { Game } from "@/@types/catalog.types";

const useAddToCollectionFeedback = () => {
  const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);

  const triggerFeedback = (skinId: number) => {
    setRecentlyAdded(skinId);
    setTimeout(() => setRecentlyAdded(null), 2000); // Remove o feedback após 2 segundos
  };

  return { recentlyAdded, triggerFeedback };
};

const GameCard = ({
  id,
  name,
  imageUrl,
  platforms = [],
  parentPlatforms = [],
  slug,
  releaseDate,
  developer,
  genres = [],
  metacritic,
  shortScreenshots = [],
  orientation = "vertical",
  genreMap = {},
  isFavorite: initialIsFavorite = false,
}: Game) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("gameCard");
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const { recentlyAdded, triggerFeedback } = useAddToCollectionFeedback();

  const handleFavoriteToggle = (newState: boolean) => {
    setIsFavorite(newState);
  };

  const genreNames = genres.map((id) => genreMap[id] || "").filter(Boolean);

  const allImages = [imageUrl, ...shortScreenshots].filter(Boolean);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || allImages.length <= 1) return;
    const cardRect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - cardRect.left;
    const percent = mouseX / cardRect.width;
    const newIndex = Math.floor(percent * allImages.length);
    const clampedIndex = Math.min(Math.max(newIndex, 0), allImages.length - 1);
    if (clampedIndex !== currentImageIndex) setCurrentImageIndex(clampedIndex);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  return (
    <div
      className={clsx("relative", orientation === "vertical" ? "max-w-sm" : "flex")}
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <article
        className={clsx(
          "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 group",
          orientation === "vertical" ? "w-full" : "w-full flex",
          isHovered ? "!shadow-2xl borde-b-none" : "shadow-sm",
          recentlyAdded === id ? "ring-2 ring-green-500 scale-[1.02] shadow-xl" : "",
        )}
        aria-label={name}
        onMouseMove={handleMouseMove}
      >
        {metacritic && (
          <Badge className="absolute top-2 right-2 z-10 gap-1">
            <Star size={12} />
            {metacritic}
          </Badge>
        )}

        {isHovered && allImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 z-20 px-2">
            <div className="h-1 bg-gray-200 dark:bg-gray-600 bg-opacity-50 rounded-full">
              <div
                className="h-full bg-gray-400  rounded-full transition-all duration-300"
                style={{
                  width: `${((currentImageIndex + 1) / allImages.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <Link
          href={`/game/${slug}`}
          className={clsx(
            "relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden",
            orientation === "vertical" ? "w-full aspect-video" : "w-1/3 min-w-[160px]",
          )}
        >
          {imageError || imageUrl === "" ? (
            <div className="p-4 text-gray-400 h-full items-center flex justify-center">
              <Gamepad size={40} className="mx-auto" />
              <span className="sr-only">{t("noImage")}</span>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={allImages[currentImageIndex] || ""}
                alt={`Capa do jogo ${name}`}
                fill
                className={clsx(
                  "object-cover transition-all duration-500",
                  isHovered ? "scale-110" : "scale-100",
                )}
                sizes={orientation === "vertical" ? "(max-width: 640px) 100vw, 320px" : "240px"}
                onError={() => setImageError(true)}
                priority
              />
            </div>
          )}
        </Link>

        <div
          className={clsx(
            "p-4 bg-white dark:bg-gray-900 relative",
            orientation === "horizontal" && "flex-1",
          )}
        >
          <div className="flex justify-between items-start min-h-[60px]">
            <Link href={`/game/${slug}`} className="block flex-1">
              <h2 className="font-semibold text-sm md:text-lg text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {name}
              </h2>
            </Link>
          </div>

          {developer && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
              {developer}
            </p>
          )}

          {parentPlatforms.length && <PlatformIcons platforms={parentPlatforms} />}

          <div className="sm:flex justify-between mt-3">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar
                size={14}
                className="mr-1.5 flex-shrink-0"
                aria-label={t("noReleaseDate")}
              />

              {releaseDate ? (
                <span>{new Date(releaseDate).toLocaleDateString()}</span>
              ) : (
                <span>-</span>
              )}
            </div>
            <div className="flex justify-end">
              <AddGameToCollection
                gameId={id}
                platforms={platforms} // array de IDs
                isFavorite={isFavorite}
                onFavoriteToggle={handleFavoriteToggle}
                onAddSuccess={() => triggerFeedback(id)}
              />
            </div>
          </div>

          {/* Gêneros visíveis em linha */}
          {genreNames.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {genreNames.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full truncate max-w-[100px]"
                >
                  {genre}
                </span>
              ))}
              {genreNames.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  +{genreNames.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default GameCard;
