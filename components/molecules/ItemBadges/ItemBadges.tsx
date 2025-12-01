import React from "react";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Box, FileText, Gamepad2, Disc3 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ItemBadgesProps {
  hasBox?: boolean;
  hasManual?: boolean;
  className?: string;
  gamesCount?: number;
  accessoriesCount?: number;
}

export const ItemBadges = ({
  hasBox,
  hasManual,
  className,
  gamesCount,
  accessoriesCount,
}: ItemBadgesProps) => {
  const t = useTranslations("ConsoleDetails");

  return (
    <div className={`flex flex-wrap gap-2 -ms-2 ${className || ""}`}>
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
      {gamesCount !== undefined && gamesCount > 0 && (
        <Badge variant="soft" className="flex items-center gap-1">
          <Disc3 size={12} /> {gamesCount}x {t("games")}
        </Badge>
      )}
      {accessoriesCount !== undefined && accessoriesCount > 0 && (
        <Badge variant="soft" className="flex items-center gap-1">
          <Gamepad2 size={12} /> {accessoriesCount}x {t("accessories")}
        </Badge>
      )}
    </div>
  );
};
