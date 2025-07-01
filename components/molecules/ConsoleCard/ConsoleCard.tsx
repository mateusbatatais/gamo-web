// components/molecules/ConsoleCard.tsx

import { Button, ButtonVariant, ButtonStatus } from "@/components/atoms/Button/Button";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import { Monitor, Gamepad } from "lucide-react";
import { ConsoleCardSkeleton } from "./ConsoleCard.skeleton";

export interface ConsoleCardProps {
  name: string;
  consoleName: string;
  loading?: boolean;
  brand: string;
  imageUrl: string;
  description: string;
  slug: string;
  className?: string;
  buttonVariant?: ButtonVariant;
  buttonStatus?: ButtonStatus;
  buttonLabel?: string;
  orientation?: "vertical" | "horizontal";
  badge?: ReactNode;
  children?: ReactNode;
}

const ConsoleCard = ({
  name,
  loading = false,
  consoleName,
  brand,
  imageUrl,
  description,
  slug,
  className,
  buttonVariant = "primary",
  buttonStatus = "default",
  buttonLabel = "View Details",
  orientation = "vertical",
  badge,
  children,
}: ConsoleCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Normaliza a URL da imagem
  const normalizeImageUrl = (url: string) => {
    if (!url) return "/default-console.webp";

    // Remove barras duplas no início
    if (url.startsWith("//")) {
      return url.slice(1);
    }

    // Garante que comece com uma barra
    if (!url.startsWith("/")) {
      return `/${url}`;
    }

    return url;
  };

  if (loading) {
    return <ConsoleCardSkeleton />;
  }

  return (
    <article
      className={clsx(
        "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        orientation === "vertical" ? "max-w-sm" : "flex max-w-2xl",
        className,
      )}
      aria-label={`${consoleName} - ${brand}`}
    >
      <div
        className={clsx(
          "relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center",
          orientation === "vertical" ? "w-full aspect-video" : "w-1/3 min-w-[160px]",
        )}
      >
        <Link href={`/console/${slug}`} className="block">
          {imageError ? (
            <div className="p-4 text-gray-400">
              {consoleName.includes("Console") ? (
                <Monitor size={40} className="mx-auto" />
              ) : (
                <Gamepad size={40} className="mx-auto" />
              )}
              <span className="sr-only">Imagem não disponível</span>
            </div>
          ) : (
            <Image
              src={normalizeImageUrl(imageUrl)}
              alt={`${name} console`}
              fill
              className="object-cover"
              sizes={orientation === "vertical" ? "(max-width: 640px) 100vw, 320px" : "240px"}
              onError={() => setImageError(true)}
              priority={true}
            />
          )}
        </Link>
        {badge && <div className="absolute top-2 right-2 z-10">{badge}</div>}
      </div>

      <div
        className={clsx("p-4 bg-white dark:bg-gray-900", orientation === "horizontal" && "flex-1")}
      >
        <header className="mb-2">
          <Link href={`/console/${slug}`} className="block">
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              {consoleName}
            </h2>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-600 dark:text-gray-300">{name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{brand}</p>
            </div>
            {children}
          </div>
        </header>

        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 mb-4 line-clamp-2">
          {description}
        </p>

        <Link href={`/console/${slug}`} className="block">
          <Button
            variant={buttonVariant}
            status={buttonStatus}
            className="w-full mt-auto"
            label={buttonLabel}
          />
        </Link>
      </div>
    </article>
  );
};

export default ConsoleCard;
