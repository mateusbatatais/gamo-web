// app/[locale]/profile/collection/games/import/page.tsx
"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { GameImportWizard } from "@/components/organisms/_game/GameImportWizard/GameImportWizard";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ImportGamesPage() {
  const t = useTranslations("GameImport");
  const { setItems } = useBreadcrumbs();
  const { user } = useAuth();

  useEffect(() => {
    setItems([{ label: user?.slug || "", href: `/user/${user?.slug}` }, { label: t("title") }]);

    return () => setItems([]);
  }, [setItems, t, user]);

  return (
    <div className="container mx-auto max-w-6xl py-6 px-4 sm:px-6">
      <GameImportWizard />
    </div>
  );
}
