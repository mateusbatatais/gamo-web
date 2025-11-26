import { useTranslations } from "next-intl";

export type IconType = "library" | "plus" | "tag" | "newspaper" | "shopping-bag";

export type MenuItem = {
  id: string;
  label: string;
  iconType?: IconType;
  href?: string;
  onClick?: () => void;
};

export function useHeaderMenuData(): {
  consolesItems: MenuItem[];
  gamesItems: MenuItem[];
  accessoriesItems: MenuItem[];
  directLinks: MenuItem[];
} {
  const t = useTranslations("Header");

  const consolesItems: MenuItem[] = [
    {
      id: "view-catalog-consoles",
      label: t("consoles.viewCatalog"),
      iconType: "library",
      href: "/console-catalog",
    },
    {
      id: "add-collection-consoles",
      label: t("consoles.addCollection"),
      iconType: "plus",
      href: "/user/collection/consoles/add?type=collection",
    },
    {
      id: "sell-buy-consoles",
      label: t("consoles.sellBuy"),
      iconType: "tag",
      href: "/user/collection/consoles/add?type=trade",
    },
  ];

  const gamesItems: MenuItem[] = [
    {
      id: "view-catalog-games",
      label: t("games.viewCatalog"),
      iconType: "library",
      href: "/game-catalog",
    },
    {
      id: "add-collection-games",
      label: t("games.addCollection"),
      iconType: "plus",
      href: "/user/collection/games/add?type=collection",
    },
    {
      id: "sell-buy-games",
      label: t("games.sellBuy"),
      iconType: "tag",
      href: "/user/collection/games/add?type=trade",
    },
  ];

  const accessoriesItems: MenuItem[] = [
    {
      id: "view-catalog-accessories",
      label: t("accessories.viewCatalog"),
      iconType: "library",
      href: "/accessory-catalog",
    },
    {
      id: "add-collection-accessories",
      label: t("accessories.addCollection"),
      iconType: "plus",
      href: "/user/collection/accessories/add?type=collection",
    },
    {
      id: "sell-buy-accessories",
      label: t("accessories.sellBuy"),
      iconType: "tag",
      href: "/user/collection/accessories/add?type=trade",
    },
  ];

  const directLinks: MenuItem[] = [
    {
      id: "marketplace",
      label: t("marketplace"),
      iconType: "shopping-bag",
      href: "/marketplace",
    },
  ];

  return { consolesItems, gamesItems, accessoriesItems, directLinks };
}
