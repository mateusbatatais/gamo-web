"use client";

import React from "react";
import useAccessoryMarket from "@/hooks/useAccessoryMarket";
import MarketList from "@/components/organisms/MarketList/MarketList";
import { useTranslations } from "next-intl";

interface AccessoryMarketProps {
  slug: string;
}

export default function AccessoryMarket({ slug }: AccessoryMarketProps) {
  const { data, isLoading, isError } = useAccessoryMarket(slug);
  const t = useTranslations("AccessoryDetails"); // Using AccessoryDetails or ConsoleDetails depending on where "Mercado" is

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
