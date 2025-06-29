// components/molecules/ConsoleCard.tsx
import { Button, ButtonVariant, ButtonStatus } from "@/components/atoms/Button/Button";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ReactNode } from "react";

export interface ConsoleCardProps {
  name: string;
  consoleName: string;
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
          "relative bg-gray-100 dark:bg-gray-800",
          orientation === "vertical" ? "w-full aspect-video" : "w-1/3 min-w-[160px]",
        )}
      >
        <Image
          src={`/${imageUrl}`}
          alt={`${name} console`}
          fill
          className="object-cover"
          sizes={orientation === "vertical" ? "(max-width: 640px) 100vw, 320px" : "240px"}
        />
        {badge && <div className="absolute top-2 right-2">{badge}</div>}
      </div>

      <div
        className={clsx("p-4 bg-white dark:bg-gray-900", orientation === "horizontal" && "flex-1")}
      >
        <header className="mb-2">
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{consoleName}</h2>
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

        <Link href={`/console/${slug}`}>
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
