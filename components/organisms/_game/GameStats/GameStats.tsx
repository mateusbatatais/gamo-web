import { GameStats as GameStatsType } from "@/@types/catalog.types";
import { Card } from "@/components/atoms/Card/Card";
import { useTranslations } from "next-intl";

interface GameStatsProps {
  stats?: GameStatsType;
}

export const GameStats = ({ stats }: GameStatsProps) => {
  const t = useTranslations("GameDetails");

  return (
    <Card className="bg-gray-50 dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
        {t("stats")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {stats?.owned ?? 0}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 font-medium">
            {t("owned")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-accent-600 dark:text-accent-400">
            {stats?.playing ?? 0}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 font-medium">
            {t("playing")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-success-600 dark:text-success-400">
            {stats?.completed ?? 0}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 font-medium">
            {t("beaten")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-danger-600 dark:text-danger-400">
            {stats?.abandoned ?? 0}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 font-medium">
            {t("dropped")}
          </p>
        </div>
      </div>
    </Card>
  );
};
