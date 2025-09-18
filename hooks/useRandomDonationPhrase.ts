// hooks/useRandomDonationPhrase.ts
"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export function useRandomDonationPhrase() {
  const t = useTranslations("DonationPhrases");
  const [randomPhrase, setRandomPhrase] = useState("");

  useEffect(() => {
    const phraseKeys = [
      "dropCoins",
      "sponsorConsole",
      "sponsorGame",
      "supportQuest",
      "stockInventory",
      "refillMana",
      "helpLevelUp",
    ];

    // Gera um índice aleatório baseado em um seed consistente
    const randomIndex = Math.floor(Math.random() * phraseKeys.length);
    setRandomPhrase(t(phraseKeys[randomIndex]));
  }, [t]);

  return randomPhrase;
}
