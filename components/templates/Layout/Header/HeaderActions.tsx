"use client";

import { Button } from "@/components/atoms/Button/Button";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";
import LocaleSwitcher from "@/components/molecules/LocaleSwitcher/LocaleSwitcher";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { Avatar } from "@/components/atoms/Avatar/Avatar";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { MenuItem } from "./menuData";
import { renderIcon } from "./iconRenderer";

type Props = {
  user: { name: string; profileImage?: string; slug: string } | null;
  accountItems: MenuItem[];
  isScrolled: boolean;
};

export default function HeaderActions({ user, accountItems, isScrolled }: Props) {
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
      <div className="hidden lg:flex items-center space-x-2">
        <ThemeToggle />
        <LocaleSwitcher />
      </div>

      {user ? (
        <Dropdown
          trigger={
            <div className="flex items-center space-x-1 cursor-pointer">
              <Avatar src={user.profileImage} alt={user.name} size="xs" />
              <ChevronDown size={18} />
            </div>
          }
          items={formatItems(accountItems)}
          menuProps={{
            className: "mt-2",
          }}
        />
      ) : (
        <Link href="/login">
          <Button variant="transparent" className="flex items-center gap-2" label={t("login")} />
        </Link>
      )}
    </div>
  );
}
