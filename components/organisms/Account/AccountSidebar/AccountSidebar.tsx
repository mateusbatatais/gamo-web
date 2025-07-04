// components/organisms/AccountSidebar/AccountSidebar.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { LogOut, Home, User, Lock, ShoppingBag, Package, Shield, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileImagePlaceholder from "../ProfileImagePlaceholder/ProfileImagePlaceholder";
import Image from "next/image";

export default function AccountSidebar() {
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
    <nav className="border border-neutral-300 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700">
      <div className="flex flex-col items-center gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-gray-700">
        {user?.profileImage ? (
          <Image
            src={user?.profileImage}
            alt="Avatar"
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        ) : (
          <ProfileImagePlaceholder />
        )}
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
  );
}
