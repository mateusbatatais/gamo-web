"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/atoms/Button/Button";
import HeaderMenuDesktop from "./HeaderMenuDesktop";
import HeaderMenuMobile from "./HeaderMenuMobile";
import HeaderActions from "./HeaderActions";
import { useHeaderMenuData, MenuItem } from "./menuData";
import HeaderLogo from "./HeaderLogo";

export default function Header() {
  const t = useTranslations("Header");
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { consolesItems, gamesItems, accessoriesItems, directLinks } = useHeaderMenuData();

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
    if (isMenuOpen) {
      setIsScrolled(window.scrollY > 0);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsScrolled(window.scrollY > 0);
  };

  const accountItems: MenuItem[] = user
    ? [
        {
          id: "account",
          label: t("myAccount"),
          href: "/account",
        },
        {
          id: `/user/${user.slug}`,
          label: t("viewProfile"),
          href: `/user/${user.slug}`,
        },
        {
          id: "wishlist",
          label: t("wishlist"),
          href: "/wishlist",
        },
        {
          id: "logout",
          label: t("logout"),
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
          <HeaderLogo isScrolled={isScrolled} />

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
            />
          </div>

          <HeaderMenuDesktop
            consolesItems={consolesItems}
            gamesItems={gamesItems}
            accessoriesItems={accessoriesItems}
            directLinks={directLinks}
            isScrolled={isScrolled}
          />
          <HeaderActions user={user} accountItems={accountItems} isScrolled={isScrolled} />
        </div>

        <HeaderMenuMobile
          isOpen={isMenuOpen}
          onClose={closeMenu}
          user={user}
          accountItems={accountItems}
          consolesItems={consolesItems}
          gamesItems={gamesItems}
          accessoriesItems={accessoriesItems}
          directLinks={directLinks}
        />
      </div>
    </header>
  );
}
