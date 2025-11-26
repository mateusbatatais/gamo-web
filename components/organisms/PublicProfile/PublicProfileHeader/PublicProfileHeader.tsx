"use client";

// components/organisms/PublicProfile/PublicProfileHeader/PublicProfileHeader.tsx
import React from "react";
import { Avatar } from "@/components/atoms/Avatar/Avatar";
import { PublicUserProfile } from "@/@types/auth.types";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Tooltip } from "@/components/atoms/Tooltip/Tooltip";
import { WhatsAppButton } from "@/components/atoms/WhatsAppButton/WhatsAppButton";
interface PublicProfileHeaderProps {
  profile: PublicUserProfile;
}

export const PublicProfileHeader = ({ profile }: PublicProfileHeaderProps) => {
  const t = useTranslations("PublicProfile");
  const format = useFormatter();

  const formatMemberSince = (dateString: string) => {
    return format.dateTime(new Date(dateString), {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-6">
      <div className="shrink-0">
        <Avatar src={profile.profileImage} alt={profile.name} size="xl" />
      </div>

      <div className="grow">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{profile.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {profile.description || t("defaultBio")}
            </p>
          </div>
          {profile.phone && profile.phone !== "" && (
            <div className="flex flex-wrap gap-2">
              <WhatsAppButton phone={profile.phone || ""} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge className="text-sm" variant="soft">
            🏅 {t("memberSince")} {formatMemberSince(profile.memberSince)}
          </Badge>
          {/* 
          
          AQUI VAMOS TER VARIAS REGRAS:

          Colecionador Casual — 10 itens. (nível Bronze → 10 / Prata → 50 / Ouro → 150 / Lendário → 500)
          Prateleira Lotada — 250 itens. 
          Console Variante Hunter — 50 variações/skins adicionadas 
          Acessory Variante Hunter — 50 variações/skins adicionadas 
          Bem-vindo — criou conta (instantâneo).
          1 Mês de Gamo — 30 dias ativos.
          Veterano — 1 ano na plataforma (2 anos, 5 anos como níveis).
          First Play — marcar 1 jogo como “jogado”. (progresso > 1 e menor que 10)
          Maratonista — 10 jogos jogados. (níveis: 10/50/200) (progresso > 1)
          Crítico — 1 review escrita (para isso, temos que saber quantos jogos temos preenchido o campo "review")
          Opinião de Peso — 25 reviews (ou 100 avaliações).
          Finalizador - (jogos com progresso 10)
          Sonysta - mais de 5 consoles da marca sony
          Nintendista - mais de 5 consoles da marca nintendo 
          xboxista - mais de 5 consoles da marca microsoft
          Segista - mais de 5 consoles da marca sega
          Coleção Retro — >= X consoles pré-1999.
          Edição Limitada — possui >= 5 edições “limited/collector”.
          Detective — encontrou um item com metadata incomum (ou reportou e ajudou a corrigir dados).
          Já Tive — adicionou >50 itens com status “já tive”.
          Fã Obsessivo — > 90% da coleção é de um único console/franquia.


          // qual vai ser a regra pra isso?
          <Badge className="text-sm" variant="soft">
            🏆 Top Collector
          </Badge> 
          
          
          PRECISAMOS DISPARAR EMAIL QUANDO O USUÀRIO ALCANÇAR UMA NOVA CONQUISTA
          */}

          {profile.gamesByGenre.actionAdventure >= 50 && (
            <Tooltip title={t("achievementActionBoy")}>
              <Badge className="text-sm" variant="soft">
                💥 Action boy
              </Badge>
            </Tooltip>
          )}
          {profile.gamesByGenre.sports >= 50 && (
            <Tooltip title={t("achievementSportsFan")}>
              <Badge className="text-sm" variant="soft">
                ⚽ Sports Fan
              </Badge>
            </Tooltip>
          )}
          {profile.gamesByGenre.racing >= 50 && (
            <Tooltip title={t("achievementNeedSpeed")}>
              <Badge className="text-sm" variant="soft">
                🏎️ Need Speed
              </Badge>
            </Tooltip>
          )}
          {profile.gamesByGenre.fighting >= 50 && (
            <Tooltip title={t("achievementReadyToFight")}>
              <Badge className="text-sm" variant="soft">
                🥊 Ready to Fight
              </Badge>
            </Tooltip>
          )}
          {profile.gamesByGenre.shooter >= 50 && (
            <Tooltip title={t("achievementSharpShooter")}>
              <Badge className="text-sm" variant="soft">
                🎯 Bullseye
              </Badge>
            </Tooltip>
          )}

          <Badge className="text-sm" variant="soft">
            🖥️ {profile.consolesTotal} Consoles
          </Badge>
          <Badge className="text-sm" variant="soft">
            👾 {profile.gamesTotal} {t("games")}
          </Badge>
          <Badge className="text-sm" variant="soft">
            🎮 {profile.accessoriesTotal} {t("accessories")}
          </Badge>
          <Badge className="text-sm" variant="soft">
            ❤️ {profile.gamesFavorited} {t("favoriteGames")}
          </Badge>
          <Badge className="text-sm" variant="soft">
            ⭐ {profile.gamesReviewed} {t("reviews")}
          </Badge>
        </div>
      </div>
    </div>
  );
};
