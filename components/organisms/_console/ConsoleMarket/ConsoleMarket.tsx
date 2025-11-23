"use client";

import React from "react";
import useConsoleMarket from "@/hooks/useConsoleMarket";
import MarketList from "@/components/organisms/MarketList/MarketList";
import { useTranslations } from "next-intl";

interface ConsoleMarketProps {
  variantSlug: string;
}

export default function ConsoleMarket({ variantSlug }: ConsoleMarketProps) {
  const { data, isLoading, isError } = useConsoleMarket(variantSlug);
  const t = useTranslations("ConsoleDetails");

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
