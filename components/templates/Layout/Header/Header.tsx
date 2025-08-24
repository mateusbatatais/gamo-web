// components/templates/Layout/Header/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";
import LocaleSwitcher from "@/components/molecules/LocaleSwitcher/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  Bell,
  User,
  Heart,
  LogOut,
  ChevronDown,
  Gamepad,
  Joystick,
  Gamepad2,
  SquareUserRound,
} from "lucide-react";
import clsx from "clsx";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { Button } from "@/components/atoms/Button/Button";
import { Avatar } from "@/components/atoms/Avatar/Avatar";

export default function Header() {
  const t = useTranslations("Header");
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 0);
      }, 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const catalogItems = [
    {
      id: "consoles",
      label: t("catalog.consoles"),
      icon: <Gamepad size={16} />,
      href: "/console-catalog",
    },
    {
      id: "accessories",
      label: t("catalog.accessories"),
      icon: <Joystick size={16} />,
      href: "/accessorie-catalog",
    },
    {
      id: "games",
      label: t("catalog.games"),
      icon: <Gamepad2 size={16} />,
      href: "/game-catalog",
    },
  ];

  const accountItems = user
    ? [
        {
          id: "account",
          label: t("myAccount"),
          icon: <User size={16} />,
          href: "/account",
        },
        {
          id: `/user/${user.slug}`,
          label: t("viewProfile"),
          icon: <SquareUserRound size={16} />,
          href: `/user/${user.slug}`,
        },
        {
          id: "wishlist",
          label: t("wishlist"),
          icon: <Heart size={16} />,
          href: "/wishlist",
        },
        {
          id: "logout",
          label: t("logout"),
          icon: <LogOut size={16} />,
          onClick: () => logout(),
        },
      ]
    : [];

  return (
    <header
      className={clsx(
        "bg-white shadow-sm dark:bg-gray-900 sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "py-2" : "py-4",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={clsx(
              "text-2xl font-bold text-gray-800 dark:text-gray-100 flex-shrink-0 transition-all",
              isScrolled ? "w-10" : "w-32",
            )}
          >
            {isScrolled ? (
              <Image
                src="/images/icon-gamo.svg"
                alt={t("altLogo")}
                className="h-auto w-full"
                width={130}
                height={40}
                priority={true}
              />
            ) : (
              <Image
                src="/images/logo-gamo.svg"
                alt={t("altLogo")}
                className="h-auto w-full"
                width={130}
                height={40}
                priority={true}
              />
            )}
          </Link>

          <div
            className={clsx(
              "hidden md:block mx-4 transition-all duration-300",
              isScrolled ? "max-w-md w-full" : "max-w-xl w-full",
            )}
          >
            {/* Filtro Removido por mudança de fluxo*/}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Barra de busca - mobile */}
            <div className="md:hidden">{/* Filtro Removido por mudança de fluxo*/}</div>

            <Button
              onClick={toggleMenu}
              variant="transparent"
              size="sm"
              className="md:hidden"
              icon={isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            ></Button>
          </div>

          <div
            className={clsx(
              "hidden md:flex items-center space-x-4 transition-all",
              isScrolled ? "text-sm" : "text-base",
            )}
          >
            <Dropdown
              label={t("catalog.title")}
              variant="transparent"
              items={catalogItems}
              menuProps={{
                className: "mt-2",
              }}
            />

            <div className="hidden md:flex ">
              <Button size="sm" icon={<Bell size={20} />} variant="transparent"></Button>
              <ThemeToggle />
              <LocaleSwitcher />
            </div>

            {user ? (
              <Dropdown
                trigger={
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <Avatar src={user.profileImage} alt={user.name} size="xs" />
                    <ChevronDown size={16} />
                  </div>
                }
                items={accountItems}
                menuProps={{
                  className: "mt-2",
                }}
              />
            ) : (
              <Link href="/login">
                <Button
                  variant="transparent"
                  className="flex items-center gap-2"
                  label={t("login")}
                ></Button>
              </Link>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 mt-2">
            <nav className="flex flex-col space-y-3">
              <div className="relative">
                <h3>{t("catalog.title")}</h3>
                <div className="pl-4 mt-2 space-y-3">
                  {catalogItems.map((item) => (
                    <Link key={item.id} href={item.href!} onClick={() => setIsMenuOpen(false)}>
                      <div className="flex items-center gap-2 py-1 ">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {user ? (
                <>
                  {accountItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href!}
                      onClick={() => {
                        item.onClick?.();
                        setIsMenuOpen(false);
                      }}
                      className="flex gap-2 items-center "
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("login")}
                </Link>
              )}

              {/* Ícones no mobile (dentro do menu) */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <LocaleSwitcher />
                  <Button size="sm" icon={<Bell size={20} />} variant="transparent"></Button>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
