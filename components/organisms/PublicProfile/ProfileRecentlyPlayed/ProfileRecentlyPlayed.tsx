// components/organisms/PublicProfile/ProfileRecentlyPlayed/ProfileRecentlyPlayed.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";

interface RecentlyPlayedItem {
  title: string;
  platform: string;
  date: string;
  hours: number;
}

interface ProfileRecentlyPlayedProps {
  items: RecentlyPlayedItem[];
}

export const ProfileRecentlyPlayed = ({ items }: ProfileRecentlyPlayedProps) => {
  const t = useTranslations("PublicProfile");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold dark:text-white">{t("recentlyPlayed")}</h3>
        <Button variant="transparent" size="sm">
          {t("seeMore")}
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
              <div className="ml-3">
                <p className="font-medium dark:text-white">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {item.platform}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.hours}h jogadas
                  </span>
                </div>
              </div>
            </div>
            <span className="text-gray-500 dark:text-gray-400">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
