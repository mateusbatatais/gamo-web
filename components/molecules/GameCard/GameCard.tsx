import { Button } from "@/components/atoms/Button/Button";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { useTranslations } from "next-intl";

export interface GameCardProps {
  title: string;
  imageUrl: string;
  platforms?: { id: number; name: string; slug: string }[];
  slug: string;
  releaseDate?: string;
  developer?: string;
  orientation?: "vertical" | "horizontal";
}

const GameCard = ({
  title,
  imageUrl,
  platforms = [], // Alterado para array de objetos
  slug,
  releaseDate,
  developer,
  orientation = "vertical",
}: GameCardProps) => {
  const [imageError, setImageError] = useState(false);
  const t = useTranslations();

  return (
    <article
      className={clsx(
        "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        orientation === "vertical" ? "max-w-sm" : "flex",
      )}
      aria-label={title}
    >
      <div
        className={clsx(
          "relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center",
          orientation === "vertical" ? "w-full aspect-video" : "w-1/3 min-w-[160px]",
        )}
      >
        <Link href={`/game/${slug}`} className="block relative w-full h-full">
          {imageError ? (
            <div className="p-4 text-gray-400 h-full items-center flex justify-center">
              <div className="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center">
                <span className="sr-only">{t("noImage")}</span>
              </div>
            </div>
          ) : (
            <Image
              src={imageUrl || "/placeholder-game.jpg"}
              alt={`Capa do jogo ${title}`}
              fill
              className="object-cover"
              sizes={orientation === "vertical" ? "(max-width: 640px) 100vw, 320px" : "240px"}
              onError={() => setImageError(true)}
              priority
            />
          )}
        </Link>
      </div>

      <div
        className={clsx("p-4 bg-white dark:bg-gray-900", orientation === "horizontal" && "flex-1")}
      >
        <header className="mb-2">
          <Link href={`/game/${slug}`} className="block">
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{title}</h2>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              {developer && <p className="text-sm text-gray-600 dark:text-gray-300">{developer}</p>}
              {platforms && platforms.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {platforms.map((p) => p.name).join(", ")} {/* Alterado para mapear os nomes */}
                </p>
              )}
              {releaseDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(releaseDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </header>

        <Link href={`/game/${slug}`} className="block mt-4">
          <Button variant="primary" className="w-full" label="Ver detalhes" />
        </Link>
      </div>
    </article>
  );
};

export default GameCard;
