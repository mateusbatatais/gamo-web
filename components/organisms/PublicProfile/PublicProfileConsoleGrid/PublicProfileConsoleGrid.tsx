// components/organisms/PublicProfile/PublicProfileConsoleGrid.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { UserConsolePublic } from "@/@types/publicProfile";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";

interface PublicProfileConsoleGridProps {
  consoles: UserConsolePublic[];
}

export const PublicProfileConsoleGrid = ({ consoles }: PublicProfileConsoleGridProps) => {
  const t = useTranslations("PublicProfile");

  if (consoles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t("noConsoles")}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">{t("collection")}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {consoles.map((consoleItem) => (
          <PublicProfileConsoleCard key={consoleItem.id} consoleItem={consoleItem} />
        ))}
      </div>
    </div>
  );
};
