// components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { UserConsolePublic } from "@/@types/publicProfile";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";
import { Card } from "@/components/atoms/Card/Card";

interface PublicProfileConsoleGridProps {
  consoles: UserConsolePublic[];
}

export const PublicProfileConsoleGrid = ({ consoles }: PublicProfileConsoleGridProps) => {
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("collection")}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {consoles
          .filter((consoleItem) => consoleItem.status === "OWNED")
          .map((consoleItem) => (
            <PublicProfileConsoleCard key={`owned-${consoleItem.id}`} consoleItem={consoleItem} />
          ))}
      </div>

      <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.selling")}</h2>

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {consoles
          .filter((consoleItem) => consoleItem.status === "SELLING")
          .map((consoleItem) => (
            <PublicProfileConsoleCard key={`selling-${consoleItem.id}`} consoleItem={consoleItem} />
          ))}
      </div>
      <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.lookingFor")}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {consoles
          .filter((consoleItem) => consoleItem.status === "LOOKING_FOR")
          .map((consoleItem) => (
            <PublicProfileConsoleCard
              key={`lookingfor-${consoleItem.id}`}
              consoleItem={consoleItem}
            />
          ))}
      </div>
    </div>
  );
};
