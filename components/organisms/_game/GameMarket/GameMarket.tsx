"use client";

import React from "react";
import useGameMarket from "@/hooks/useGameMarket";
import MarketList from "@/components/organisms/MarketList/MarketList";
import { useTranslations } from "next-intl";

interface GameMarketProps {
  slug: string;
}

export default function GameMarket({ slug }: GameMarketProps) {
  const { data, isLoading, isError } = useGameMarket(slug);
  const t = useTranslations("GameDetails");

  if (isError) {
    return null;
  }

  const items = data?.items || [];

  return (
    <MarketList
      items={items}
      isLoading={isLoading}
      title={t("market")}
      emptyMessage={t("noItems")}
    />
  );
}
