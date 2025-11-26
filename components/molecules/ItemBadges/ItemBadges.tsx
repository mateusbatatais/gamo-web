import React from "react";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Box, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

interface ItemBadgesProps {
  condition?: string | null;
  hasBox?: boolean;
  hasManual?: boolean;
  className?: string;
}

export const ItemBadges = ({ condition, hasBox, hasManual, className }: ItemBadgesProps) => {
  const t = useTranslations("ConsoleDetails");

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case "NEW":
        return "Novo";
      case "USED":
        return "Usado";
      case "REFURBISHED":
        return "Recondicionado";
      default:
        return condition;
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className || ""}`}>
      {condition && (
        <Badge variant="soft" status="info">
          {getConditionLabel(condition)}
        </Badge>
      )}
      {hasBox && (
        <Badge variant="soft" className="flex items-center gap-1">
          <Box size={12} /> {t("box")}
        </Badge>
      )}
      {hasManual && (
        <Badge variant="soft" className="flex items-center gap-1">
          <FileText size={12} /> {t("manual")}
        </Badge>
      )}
    </div>
  );
};
