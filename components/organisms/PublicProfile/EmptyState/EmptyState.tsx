// components/organisms/PublicProfile/EmptyState/EmptyState.tsx - VERSÃO SIMPLIFICADA
"use client";

import React from "react";
import { Card } from "@/components/atoms/Card/Card";
import { EmptyCard } from "../EmptyCard/EmptyCard";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  type: "games" | "consoles" | "accessories" | "global";
  marketType?: "selling" | "looking";
  isOwner: boolean | undefined;
  viewMode?: "grid" | "list" | "table" | "compact";
}

// 🆕 FUNÇÃO PARA MAPEAR viewMode
const mapViewMode = (
  viewMode: "grid" | "list" | "table" | "compact",
): "card" | "list" | "table" | "compact" => {
  if (viewMode === "grid") return "card";
  return viewMode;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  marketType = "selling",
  isOwner,
  viewMode = "list",
}) => {
  const t = useTranslations("PublicProfile");

  // 🆕 CONFIGURAÇÕES SEPARADAS
  const itemConfigs = {
    games: {
      text: t("txtGame"),
      addButton: marketType === "selling" ? t("txtSellGame") : t("txtLookForGame"),
      link: "/user/collection/games/add/",
      noItems: marketType === "selling" ? t("noGamesForSale") : t("noGamesLookingFor"),
    },
    consoles: {
      text: t("txtConsole"),
      addButton: marketType === "selling" ? t("txtSellConsole") : t("txtLookForConsole"),
      link: "/user/collection/consoles/add/",
      noItems: marketType === "selling" ? t("noConsolesForSale") : t("noConsolesLookingFor"),
    },
    accessories: {
      text: t("txtAccessory"),
      addButton: marketType === "selling" ? t("txtSellAccessory") : t("txtLookForAccessory"),
      link: "/user/collection/accessories/add/",
      noItems: marketType === "selling" ? t("noAccessoriesForSale") : t("noAccessoriesLookingFor"),
    },
  };

  const globalConfig = {
    noItems: marketType === "selling" ? t("noItemsForSale") : t("noItemsLookingFor"),
  };

  // Caso global - apenas mensagem
  if (type === "global") {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{globalConfig.noItems}</p>
        </div>
      </Card>
    );
  }

  // Caso com botão de adicionar
  const config = itemConfigs[type];
  const emptyCardViewMode = mapViewMode(viewMode);

  return (
    <Card>
      <div className="py-12">
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{config.noItems}</p>
        {isOwner && (
          <EmptyCard
            text={config.text}
            buttonLabel={config.addButton}
            buttonLink={config.link}
            viewMode={emptyCardViewMode}
            isGame={type === "games"}
          />
        )}
      </div>
    </Card>
  );
};
