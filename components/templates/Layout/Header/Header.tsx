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
  Newspaper,
  ChevronRight,
  LibraryBig,
  Tag,
  CirclePlus,
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
  const [openMobileSections, setOpenMobileSections] = useState<{
    consoles: boolean;
    games: boolean;
    accessories: boolean;
  }>({
    consoles: false,
    games: false,
    accessories: false,
  });

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

  // Controlar scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      // Forçar header reduzido quando menu está aberto
      setIsScrolled(true);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Se estiver fechando o menu, restaurar o estado normal do scroll
    if (isMenuOpen) {
      setIsScrolled(window.scrollY > 0);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsScrolled(window.scrollY > 0);
  };

  const toggleMobileSection = (section: keyof typeof openMobileSections) => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Menu items para Consoles
  const consolesItems = [
    {
      id: "view-catalog-consoles",
      label: t("consoles.viewCatalog"),
      icon: <LibraryBig size={18} />,
      href: "/console-catalog",
    },
    {
      id: "add-collection-consoles",
      label: t("consoles.addCollection"),
      icon: <CirclePlus size={18} />,
      href: "/user/collection/consoles/add?type=collection",
    },
    {
      id: "sell-buy-consoles",
      label: t("consoles.sellBuy"),
      icon: <Tag size={18} />,
      href: "/user/collection/consoles/add?type=trade",
    },
  ];

  // Menu items para Games
  const gamesItems = [
    {
      id: "view-catalog-games",
      label: t("games.viewCatalog"),
      icon: <LibraryBig size={18} />,
      href: "/game-catalog",
    },
    {
      id: "add-collection-games",
      label: t("games.addCollection"),
      icon: <CirclePlus size={18} />,
      href: "/user/collection/games/add?type=collection",
    },
    {
      id: "sell-buy-games",
      label: t("games.sellBuy"),
      icon: <Tag size={18} />,
      href: "/user/collection/games/add?type=trade",
    },
  ];

  // Menu items para Acessórios
  const accessoriesItems = [
    {
      id: "view-catalog-accessories",
      label: t("accessories.viewCatalog"),
      icon: <LibraryBig size={18} />,
      href: "/accessories-catalog",
    },
    {
      id: "add-collection-accessories",
      label: t("accessories.addCollection"),
      icon: <CirclePlus size={18} />,
      href: "/user/collection/accessories/add?type=collection",
    },
    {
      id: "sell-buy-accessories",
      label: t("accessories.sellBuy"),
      icon: <Tag size={18} />,
      href: "/user/collection/accessories/add?type=trade",
    },
  ];

  // Links diretos com ícones
  const directLinks = [
    {
      id: "news",
      label: t("news"),
      icon: <Newspaper size={18} />,
      href: "/news",
    },
  ];

  const accountItems = user
    ? [
        {
          id: "account",
          label: t("myAccount"),
          icon: <User size={18} />,
          href: "/account",
        },
        {
          id: `/user/${user.slug}`,
          label: t("viewProfile"),
          icon: <SquareUserRound size={18} />,
          href: `/user/${user.slug}`,
        },
        {
          id: "wishlist",
          label: t("wishlist"),
          icon: <Heart size={18} />,
          href: "/wishlist",
        },
        {
          id: "logout",
          label: t("logout"),
          icon: <LogOut size={18} />,
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
            {/* Menu Consoles */}
            <Dropdown
              label={t("consoles.title")}
              variant="transparent"
              items={consolesItems}
              menuProps={{
                className: "mt-2",
              }}
            />

            {/* Menu Games */}
            <Dropdown
              label={t("games.title")}
              variant="transparent"
              items={gamesItems}
              menuProps={{
                className: "mt-2",
              }}
            />

            {/* Menu Acessórios */}
            <Dropdown
              label={t("accessories.title")}
              variant="transparent"
              items={accessoriesItems}
              menuProps={{
                className: "mt-2",
              }}
            />

            {/* Links diretos com ícones - Desktop */}
            {directLinks.map((link) => (
              <Link key={link.id} href={link.href}>
                <Button
                  variant="transparent"
                  className="flex items-center gap-2"
                  icon={link.icon}
                  title={link.label}
                />
              </Link>
            ))}

            <div className="hidden md:flex items-center space-x-2">
              <Button size="sm" icon={<Bell size={18} />} variant="transparent" />
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
                />
              </Link>
            )}
          </div>
        </div>

        {/* Menu mobile - Tela cheia com scroll */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-gray-900 z-50 overflow-y-auto">
            <div className="container mx-auto px-4">
              <nav className="flex flex-col ">
                {/* Menu Consoles mobile - Collapse */}
                <div className="relative">
                  <button
                    onClick={() => toggleMobileSection("consoles")}
                    className="flex items-center justify-between w-full py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Gamepad size={18} />
                      <h3>{t("consoles.title")}</h3>
                    </div>
                    <ChevronRight
                      size={18}
                      className={clsx(
                        "transition-transform duration-200",
                        openMobileSections.consoles && "rotate-90",
                      )}
                    />
                  </button>
                  {openMobileSections.consoles && (
                    <div className="pl-8 gap-3">
                      {consolesItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href!}
                          onClick={closeMenu}
                          className="block py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Menu Games mobile - Collapse */}
                <div className="relative">
                  <button
                    onClick={() => toggleMobileSection("games")}
                    className="flex items-center justify-between w-full py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Gamepad2 size={18} />
                      <h3>{t("games.title")}</h3>
                    </div>
                    <ChevronRight
                      size={18}
                      className={clsx(
                        "transition-transform duration-200",
                        openMobileSections.games && "rotate-90",
                      )}
                    />
                  </button>
                  {openMobileSections.games && (
                    <div className="pl-8 gap-3">
                      {gamesItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href!}
                          onClick={closeMenu}
                          className="block py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Menu Acessórios mobile - Collapse */}
                <div className="relative">
                  <button
                    onClick={() => toggleMobileSection("accessories")}
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
                        openMobileSections.accessories && "rotate-90",
                      )}
                    />
                  </button>
                  {openMobileSections.accessories && (
                    <div className="pl-8 gap-3">
                      {accessoriesItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href!}
                          onClick={closeMenu}
                          className="block py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Links diretos mobile com ícones */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="space-y-4">
                    {directLinks.map((link) => (
                      <Link
                        key={link.id}
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-center gap-3 py-2 text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 transition-colors"
                      >
                        {link.icon}
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Seção do usuário */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  {user ? (
                    <div className="space-y-4">
                      {accountItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href!}
                          onClick={() => {
                            item.onClick?.();
                            closeMenu();
                          }}
                          className="flex items-center gap-3 py-2 text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 transition-colors"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex items-center gap-3 py-2 text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 transition-colors"
                    >
                      <User size={18} />
                      <span className="font-medium">{t("login")}</span>
                    </Link>
                  )}
                </div>

                {/* Ícones no mobile (dentro do menu) */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <LocaleSwitcher />
                      <Button
                        size="sm"
                        icon={<Bell size={18} />}
                        variant="transparent"
                        onClick={closeMenu}
                      />
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
