import { Button } from "@/components/atoms/Button/Button";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Plus, ShoppingCart, Star, Calendar } from "lucide-react";
import { Badge } from "@/components/atoms/Badge/Badge";

const platformIcons: Record<number, string> = {
  1: "/images/icons/platforms/windows.svg", // PC
  2: "/images/icons/platforms/playstation.svg", // PlayStation
  3: "/images/icons/platforms/xbox.svg", // Xbox
  4: "/images/icons/platforms/ios.svg", // iOS (originalmente Nintendo, mas pelo slug está correto como ios)
  5: "/images/icons/platforms/apple.svg", // Apple Macintosh
  6: "/images/icons/platforms/linux.svg", // Linux
  7: "/images/icons/platforms/nintendo.svg", // Nintendo
  8: "/images/icons/platforms/android.svg", // Android
  9: "/images/icons/platforms/atari.svg", // Atari
  10: "/images/icons/platforms/commodore-amiga.svg", // Commodore / Amiga
  11: "/images/icons/platforms/sega.svg", // SEGA
  12: "/images/icons/platforms/neo-geo.svg", // Neo Geo
  13: "/images/icons/platforms/3do.svg", // 3DO
  14: "/images/icons/platforms/web.svg", // Web
};

export interface GameCardProps {
  title: string;
  imageUrl: string;
  platforms?: number[];
  slug: string;
  releaseDate?: string;
  developer?: string;
  genres?: number[];
  metacritic?: number | null;
  shortScreenshots?: string[];
  orientation?: "vertical" | "horizontal";
  genreMap?: Record<number, string>;
}

const GameCard = ({
  title,
  imageUrl,
  platforms = [],
  slug,
  releaseDate,
  developer,
  genres = [],
  metacritic,
  shortScreenshots = [],
  orientation = "vertical",
  genreMap = {},
}: GameCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const expandRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("gameCard");

  const genreNames = genres.map((id) => genreMap[id] || "").filter(Boolean);

  // Todas as imagens disponíveis (capa + screenshots)
  const allImages = [imageUrl, ...shortScreenshots].filter(Boolean);

  // Atualizar imagem com base na posição do mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || allImages.length <= 1) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - cardRect.left;
    const percent = mouseX / cardRect.width;

    // Calcular índice baseado na posição do mouse
    const newIndex = Math.floor(percent * allImages.length);
    const clampedIndex = Math.min(Math.max(newIndex, 0), allImages.length - 1);

    if (clampedIndex !== currentImageIndex) {
      setCurrentImageIndex(clampedIndex);
    }
  };

  // Resetar para a primeira imagem quando o mouse sai
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  const renderPlatformIcons = () => {
    return platforms.map((platformId) => {
      const iconSrc = platformIcons[platformId];
      if (!iconSrc) return null;

      return (
        <div key={platformId} className="w-5 h-5 relative" title={`Platform ID: ${platformId}`}>
          <Image src={iconSrc} alt="" fill className="object-contain" />
        </div>
      );
    });
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
        )}
        aria-label={title}
        onMouseMove={handleMouseMove}
      >
        {metacritic && <Badge className="absolute top-2 right-2 z-10">{metacritic}</Badge>}

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
          {imageError ? (
            <div className="p-4 text-gray-400 h-full items-center flex justify-center">
              <div className="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center">
                <span className="sr-only">{t("noImage")}</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={allImages[currentImageIndex] || "/placeholder-game.jpg"}
                alt={`Capa do jogo ${title}`}
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
          <div className="flex justify-between items-start">
            <Link href={`/game/${slug}`} className="block flex-1">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {title}
              </h2>
            </Link>

            <Button
              variant="transparent"
              className="ml-2 flex-shrink-0"
              icon={<Star size={18} />}
              aria-label={t("addToWishlist")}
            />
          </div>

          {developer && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
              {developer}
            </p>
          )}

          {platforms && platforms.length > 0 && (
            <div className="flex items-center space-x-1 mt-2">{renderPlatformIcons()}</div>
          )}
        </div>
      </article>

      <div
        ref={expandRef}
        className={clsx(
          "absolute  left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-20 transition-all duration-300 overflow-hidden",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
        )}
        style={{
          top: "100%",
          marginTop: "0",
          transformOrigin: "top center",
        }}
      >
        <div className="space-y-3">
          {releaseDate && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={14} className="mr-1.5 flex-shrink-0" />
              <span>{new Date(releaseDate).toLocaleDateString()}</span>
            </div>
          )}

          {genreNames.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("genres")}
              </p>
              <div className="flex flex-wrap gap-1">
                {genreNames.map((genre, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center"
              label={t("addToCollection")}
              icon={<Plus size={16} className="mr-1" />}
            />
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center"
              label={t("market")}
              icon={<ShoppingCart size={16} className="mr-1" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
