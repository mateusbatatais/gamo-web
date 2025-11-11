"use client";

import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { Button } from "@/components/atoms/Button/Button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { MenuItem } from "./menuData";
import { renderIcon } from "./iconRenderer";

type Props = {
  consolesItems: MenuItem[];
  gamesItems: MenuItem[];
  accessoriesItems: MenuItem[];
  directLinks: MenuItem[];
  isScrolled: boolean;
};

export default function HeaderMenuDesktop({
  consolesItems,
  gamesItems,
  accessoriesItems,
  directLinks,
  isScrolled,
}: Props) {
  const t = useTranslations("Header");

  // Converter MenuItem para formato esperado pelo Dropdown
  const formatItems = (items: MenuItem[]) =>
    items.map((item) => ({
      ...item,
      icon: renderIcon(item.iconType),
    }));

  return (
    <div
      className={clsx(
        "hidden lg:flex items-center space-x-4 transition-all",
        isScrolled ? "text-sm" : "text-base",
      )}
    >
      <Dropdown
        label={t("consoles.title")}
        variant="transparent"
        items={formatItems(consolesItems)}
        menuProps={{ className: "mt-2" }}
      />

      <Dropdown
        label={t("games.title")}
        variant="transparent"
        items={formatItems(gamesItems)}
        menuProps={{ className: "mt-2" }}
      />

      <Dropdown
        label={t("accessories.title")}
        variant="transparent"
        items={formatItems(accessoriesItems)}
        menuProps={{ className: "mt-2" }}
      />

      {directLinks.map((link) => (
        <Link key={link.id} href={link.href!}>
          <Button
            variant="transparent"
            className="flex items-center gap-2"
            icon={renderIcon(link.iconType)}
            title={link.label}
          />
        </Link>
      ))}
    </div>
  );
}
