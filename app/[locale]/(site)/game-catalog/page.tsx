"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import GameCatalogComponent from "@/components/organisms/GameCatalogComponent/GameCatalogComponent";

const GameCatalogPage = () => {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);

  return <GameCatalogComponent locale={locale} page={page} perPage={perPage} />;
};

export default GameCatalogPage;
