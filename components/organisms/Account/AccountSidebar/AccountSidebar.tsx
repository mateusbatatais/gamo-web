"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import {
  LogOut,
  Home,
  User,
  Lock,
  ShoppingBag,
  Package,
  Shield,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/atoms/Avatar/Avatar";

export default function AccountSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("account.sidebar");
  const { logout, user } = useAuth();

  const navigation = [
    { name: t("overview"), href: "/account", icon: Home },
    { name: t("details"), href: "/account/details", icon: User },
    { name: t("security"), href: "/account/security", icon: Lock },
    { name: t("sales"), href: "/account/sales", icon: ShoppingBag },
    { name: t("purchases"), href: "/account/purchases", icon: Package },
    { name: t("privacy"), href: "/account/privacy", icon: Shield },
    { name: t("settings"), href: "/account/settings", icon: Settings },
  ];

  return (
    <>
      <div className="md:hidden flex items-center justify-between w-full p-4 border border-neutral-300 rounded-lg bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700 mb-2">
        <div className="flex items-center gap-3">
          <Avatar src={user?.profileImage} alt={user?.name} size="sm" />

          <p className="font-medium">{user?.name}</p>
        </div>

        <Button
          variant="transparent"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          icon={isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        />
      </div>

      {/* Conteúdo do Sidebar (colapsável em mobile) */}
      <nav
        className={clsx(
          "border border-neutral-300 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700",
          "md:block",
          isOpen ? "block" : "hidden",
        )}
      >
        {/* Profile (visível apenas em desktop) */}
        <div className="hidden md:flex flex-col items-center gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-gray-700">
          <Avatar src={user?.profileImage} alt={user?.name} size="lg" />
          <div>
            <p className="font-medium">{user?.name}</p>
          </div>
        </div>

        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                )}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <item.icon size={20} />
                </span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Button
          onClick={logout}
          variant="transparent"
          status="danger"
          className="mt-6 w-full"
          icon={<LogOut size={16} />}
          label={t("logout")}
        />
      </nav>
    </>
  );
}
