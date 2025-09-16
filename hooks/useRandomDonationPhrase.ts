// hooks/useRandomDonationPhrase.ts
"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function useRandomDonationPhrase() {
  const t = useTranslations("DonationPhrases");

  const phraseKeys = useMemo(
    () => [
      "dropCoins",
      "sponsorConsole",
      "sponsorGame",
      "supportQuest",
      "stockInventory",
      "refillMana",
      "helpLevelUp",
    ],
    [],
  );

  return useMemo(() => {
    const randomIndex = Math.floor(Math.random() * phraseKeys.length);
    return t(phraseKeys[randomIndex]);
  }, [t, phraseKeys]);
}
