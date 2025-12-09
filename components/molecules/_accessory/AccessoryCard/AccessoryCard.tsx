import { Button, ButtonVariant, ButtonStatus } from "@/components/atoms/Button/Button";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import { normalizeImageUrl } from "@/utils/validate-url";
import { CardActionButtons } from "@/components/molecules/CardActionButtons/CardActionButtons";
import { useFavorite } from "@/hooks/useFavorite";
import { AccessoryCardSkeleton } from "./AccessoryCard.skeleton";
import { Gamepad } from "lucide-react";
import { useTranslations } from "next-intl";

export interface AccessoryCardProps {
  id: number;
  name: string;
  type: string;
  subType?: string;
  loading?: boolean;
  imageUrl: string;
  slug: string;
  className?: string;
  buttonVariant?: ButtonVariant;
  buttonStatus?: ButtonStatus;
  buttonLabel?: string;
  orientation?: "vertical" | "horizontal";
  badge?: ReactNode;
  children?: ReactNode;
  isFavorite?: boolean;
  onFavoriteToggle?: (newState: boolean) => void;
}

const AccessoryCard = ({
  id,
  name,
  type,
  subType,
  loading = false,
  imageUrl,
  slug,
  className,
  buttonVariant = "primary",
  buttonStatus = "default",
  buttonLabel,
  orientation = "vertical",
  badge,
  children,
  isFavorite = false,
  onFavoriteToggle,
}: AccessoryCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { toggleFavorite, isPending: favoriteLoading } = useFavorite();
  const t = useTranslations("");
  const defaultButtonLabel = buttonLabel ?? t("button.viewdetails");

  if (loading) {
    return <AccessoryCardSkeleton />;
  }

  const handleFavorite = async () => {
    const { added } = await toggleFavorite({
      itemId: id,
      itemType: "ACCESSORY",
    });
    onFavoriteToggle?.(added);
  };

  return (
    <article
      className={clsx(
        "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        orientation === "vertical" ? "max-w-sm" : "flex",
        className,
      )}
      aria-label={`${name} - ${type}`}
    >
      <div
        className={clsx(
          "relative bg-white p-2 flex items-center justify-center",
          orientation === "vertical" ? "w-full aspect-video" : "w-1/3 min-w-[160px]",
        )}
      >
        <Link href={`/accessory/${slug}`} className="block relative w-full h-full">
          {imageError ? (
            <div className="p-4 text-gray-400 h-full items-center flex justify-center">
              <Gamepad size={40} className="mx-auto" />
              <span className="sr-only">No image available</span>
            </div>
          ) : (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={normalizeImageUrl(imageUrl)}
                alt={`${name} accessory`}
                fill
                className={clsx(
                  "object-contain transition-opacity duration-500",
                  isImageLoading ? "opacity-0" : "opacity-100",
                )}
                sizes={orientation === "vertical" ? "(max-width: 640px) 100vw, 320px" : "240px"}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setImageError(true)}
                priority={true}
              />
            </>
          )}
        </Link>
        {badge && <div className="absolute top-2 right-2 z-10">{badge}</div>}
      </div>

      <div
        className={clsx("p-4 bg-white dark:bg-gray-900", orientation === "horizontal" && "flex-1")}
      >
        <header className="mb-2">
          <Link href={`/accessory/${slug}`} className="block">
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{name}</h2>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-600 dark:text-gray-300">{type}</h3>
              {subType && <p className="text-xs text-gray-500 dark:text-gray-400">{subType}</p>}
            </div>
            {children}
          </div>
        </header>

        <div className="flex justify-between items-center mt-4">
          <Link href={`/accessory/${slug}`} className="flex-1">
            <Button
              variant={buttonVariant}
              status={buttonStatus}
              className="w-full"
              label={defaultButtonLabel}
            />
          </Link>
          <div className="ml-2">
            <CardActionButtons
              favoriteLoading={favoriteLoading}
              actions={[
                {
                  key: "favorite",
                  active: isFavorite,
                  onClick: handleFavorite,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default AccessoryCard;
