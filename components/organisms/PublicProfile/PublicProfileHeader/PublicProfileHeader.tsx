"use client";

// components/organisms/PublicProfile/PublicProfileHeader/PublicProfileHeader.tsx
import React from "react";
import { Avatar } from "@/components/atoms/Avatar/Avatar";
import { PublicUserProfile } from "@/@types/auth.types";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Button } from "@/components/atoms/Button/Button";
import { Dropdown } from "@/components/molecules/Dropdown/Dropdown";
import { Gamepad, Joystick, Gamepad2, Phone } from "lucide-react";
interface PublicProfileHeaderProps {
  profile: PublicUserProfile;
}

export const PublicProfileHeader = ({ profile }: PublicProfileHeaderProps) => {
  const t = useTranslations("PublicProfile");

  const collectionItems = [
    {
      id: "consoles",
      label: t("catalog.consoles"),
      icon: <Gamepad size={16} />,
      href: "/user/collection/consoles/add",
    },
    {
      id: "accessories",
      label: t("catalog.accessories"),
      icon: <Joystick size={16} />,
      href: "/user/collection/accessory/add/",
    },
    {
      id: "games",
      label: t("catalog.games"),
      icon: <Gamepad2 size={16} />,
      href: "/user/collection/game/add/",
    },
  ];
  return (
    <div className="flex flex-col md:flex-row items-start gap-6">
      <div className="flex-shrink-0">
        <Avatar src={profile.profileImage} alt={profile.name} size="xl" />
      </div>

      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{profile.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {profile.description || t("defaultBio")}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Link
                href={`https://${profile.slug}.gamedesign.com`}
                target="_blank"
                className="text-primary-600 hover:underline dark:text-primary-400 text-sm"
              >
                {profile.slug}.gamedesign.com
              </Link>

              <span className="text-gray-400 hidden md:inline">•</span>

              <Link
                href="https://gamedesignhub.com.br"
                target="_blank"
                className="text-gray-600 hover:underline dark:text-gray-400 text-sm"
              >
                gamedesignhub.com.br
              </Link>

              <span className="text-gray-400 hidden md:inline">•</span>

              <Link href="#" className="text-gray-600 hover:underline dark:text-gray-400 text-sm">
                films
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dropdown
              label={t("addToCollection")}
              items={collectionItems}
              menuProps={{
                className: "mt-2",
              }}
            />
            <Button variant="transparent" size="sm" icon={<Phone />}></Button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge className="text-sm" variant="soft">
            🏅 Membro desde 2021
          </Badge>
          <Badge className="text-sm" variant="soft">
            🏆 Top Collector
          </Badge>
          <Badge className="text-sm" variant="soft">
            🖥️ {profile.consolesTotal} Consoles
          </Badge>
          <Badge className="text-sm" variant="soft">
            👾 {profile.gamesTotal} Jogos
          </Badge>
          <Badge className="text-sm" variant="soft">
            🎮 {profile.accessoriesTotal} Acessorios
          </Badge>
          <Badge className="text-sm" variant="soft">
            ❤️ {profile.gamesFavorited} Jogos Favoritos
          </Badge>
          <Badge className="text-sm" variant="soft">
            ⭐ 50 Reviews
          </Badge>
        </div>
      </div>
    </div>
  );
};
