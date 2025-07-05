// components/organisms/PublicProfile/ProfileStats/ProfileStats.tsx
import React from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

interface ProfileStatsProps {
  stats: {
    totalGames: number;
    playedThisYear: number;
    backlog: number;
    achievements: number;
  };
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => {
  const t = useTranslations("PublicProfile");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title={t("totalGames")}
        value={stats.totalGames}
        description="Total de jogos na coleção"
        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50"
      />
      <StatCard
        title={t("playedThisYear")}
        value={stats.playedThisYear}
        description="Jogados em 2025"
        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50"
      />
      <StatCard
        title={t("backlog")}
        value={stats.backlog}
        description="Jogos na lista de espera"
        className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/50 dark:to-amber-800/50"
      />
      <StatCard
        title={t("achievements")}
        value={stats.achievements}
        description="Conquistas desbloqueadas"
        className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50"
      />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  description,
  className,
}: {
  title: string;
  value: number;
  description: string;
  className?: string;
}) => (
  <div className={clsx("rounded-xl p-4 shadow-sm", className)}>
    <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
    <p className="text-2xl font-bold dark:text-white my-1">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);
