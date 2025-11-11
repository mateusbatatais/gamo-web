"use client";

import clsx from "clsx";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/atoms/Button/Button";
import LocaleSwitcher from "@/components/molecules/LocaleSwitcher/LocaleSwitcher";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";
import { ChevronRight, Gamepad, Gamepad2, Joystick, Bell, User } from "lucide-react";
import { useState } from "react";
import { MenuItem } from "./menuData";
import { renderIcon } from "./iconRenderer";
import { useTranslations } from "next-intl";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; profileImage?: string; slug: string } | null;
  accountItems: MenuItem[];
  consolesItems: MenuItem[];
  gamesItems: MenuItem[];
  accessoriesItems: MenuItem[];
  directLinks: MenuItem[];
};

export default function HeaderMenuMobile({
  isOpen,
  onClose,
  user,
  accountItems,
  consolesItems,
  gamesItems,
  accessoriesItems,
  directLinks,
}: Props) {
  const [open, setOpen] = useState({ consoles: false, games: false, accessories: false });
  const t = useTranslations("Header");

  const toggle = (section: keyof typeof open) => setOpen((p) => ({ ...p, [section]: !p[section] }));

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-gray-900 z-50 overflow-y-auto">
      <div className="container mx-auto px-4">
        <nav className="flex flex-col ">
          <div className="relative">
            <button
              onClick={() => toggle("consoles")}
              className="flex items-center justify-between w-full py-3"
            >
              <div className="flex items-center gap-3">
                <Gamepad size={18} />
                <h3>{t("consoles.title")}</h3>
              </div>
              <ChevronRight
                size={18}
                className={clsx("transition-transform duration-200", open.consoles && "rotate-90")}
              />
            </button>
            {open.consoles && (
              <div className="pl-8 gap-3">
                {consolesItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href!}
                    onClick={onClose}
                    className="block py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => toggle("games")}
              className="flex items-center justify-between w-full py-3"
            >
              <div className="flex items-center gap-3">
                <Gamepad2 size={18} />
                <h3>{t("games.title")}</h3>
              </div>
              <ChevronRight
                size={18}
                className={clsx("transition-transform duration-200", open.games && "rotate-90")}
              />
            </button>
            {open.games && (
              <div className="pl-8 gap-3">
                {gamesItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href!}
                    onClick={onClose}
                    className="block py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => toggle("accessories")}
              className="flex items-center justify-between w-full py-3"
            >
              <div className="flex items-center gap-3">
                <Joystick size={18} />
                <h3>{t("accessories.title")}</h3>
              </div>
              <ChevronRight
                size={18}
                className={clsx(
                  "transition-transform duration-200",
                  open.accessories && "rotate-90",
                )}
              />
            </button>
            {open.accessories && (
              <div className="pl-8 gap-3">
                {accessoriesItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href!}
                    onClick={onClose}
                    className="block py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div className="space-y-4">
              {directLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href!}
                  onClick={onClose}
                  className="flex items-center gap-3 py-2 text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 transition-colors"
                >
                  {renderIcon(link.iconType)}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            {user ? (
              <div className="space-y-4">
                {accountItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href!}
                    onClick={() => {
                      item.onClick?.();
                      onClose();
                    }}
                    className="flex items-center gap-3 py-2 text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 transition-colors"
                  >
                    {renderIcon(item.iconType)}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 py-2 text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 transition-colors"
              >
                <User size={18} />
                <span className="font-medium">{t("login")}</span>
              </Link>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <LocaleSwitcher />
                <Button
                  size="sm"
                  icon={<Bell size={18} />}
                  variant="transparent"
                  onClick={onClose}
                />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
