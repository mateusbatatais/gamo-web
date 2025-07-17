// components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { UserConsolePublic } from "@/@types/publicProfile";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";
import { Card } from "@/components/atoms/Card/Card";

interface PublicProfileConsoleGridProps {
  consoles: UserConsolePublic[];
  isOwner?: boolean;
  revalidate: () => Promise<void>;
}

export const PublicProfileConsoleGrid = ({
  consoles,
  isOwner = false,
  revalidate,
}: PublicProfileConsoleGridProps) => {
  const t = useTranslations("PublicProfile");

  if (consoles.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t("noConsoles")}</p>
        </div>
      </Card>
    );
  }

  const groupedConsoles = consoles.reduce(
    (acc, consoleItem) => {
      if (!acc[consoleItem.status]) {
        acc[consoleItem.status] = [];
      }
      acc[consoleItem.status].push(consoleItem);
      return acc;
    },
    {} as Record<string, UserConsolePublic[]>,
  );

  const ownedConsoles = groupedConsoles["OWNED"] || [];
  const sellingConsoles = groupedConsoles["SELLING"] || [];
  const lookingForConsoles = groupedConsoles["LOOKING_FOR"] || [];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("collection")}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {ownedConsoles.map((consoleItem) => (
          <PublicProfileConsoleCard
            key={`owned-${consoleItem.id}`}
            consoleItem={consoleItem}
            isOwner={isOwner}
            revalidate={revalidate}
          />
        ))}
      </div>
      {sellingConsoles.length > 0 && (
        <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.selling")}</h2>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {sellingConsoles.map((consoleItem) => (
          <PublicProfileConsoleCard
            key={`selling-${consoleItem.id}`}
            consoleItem={consoleItem}
            isOwner={isOwner}
            revalidate={revalidate}
          />
        ))}
      </div>
      {lookingForConsoles.length > 0 && (
        <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.lookingFor")}</h2>
      )}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {lookingForConsoles.map((consoleItem) => (
          <PublicProfileConsoleCard
            key={`lookingfor-${consoleItem.id}`}
            consoleItem={consoleItem}
            isOwner={isOwner}
            revalidate={revalidate}
          />
        ))}
      </div>
    </div>
  );
};
