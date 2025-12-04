"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { SafeImage } from "@/components/atoms/SafeImage/SafeImage";
import { useSafeImageUrl } from "@/hooks/useSafeImageUrl";
import { Link } from "@/navigation";
import { Activity, Gamepad2, Monitor, Headphones } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

export default function RecentActivitySection() {
  const t = useTranslations("HomePage.activity");
  const { data: activities, isLoading } = useRecentActivities();
  const { getSafeImageUrl } = useSafeImageUrl();
  const locale = useLocale();
  const dateLocale = locale === "pt" ? ptBR : enUS;

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!activities || activities.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "GAME":
        return <Gamepad2 size={16} className="text-purple-500" />;
      case "CONSOLE":
        return <Monitor size={16} className="text-blue-500" />;
      case "ACCESSORY":
        return <Headphones size={16} className="text-pink-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
        <Activity className="text-blue-500" /> {t("title")}
      </h3>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 group">
            {/* User Avatar */}
            <Link href={`/user/${activity.userSlug}`} className="shrink-0 relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                <SafeImage
                  src={getSafeImageUrl(activity.userImage)}
                  alt={activity.userName}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 border border-gray-100 dark:border-gray-700">
                {getIcon(activity.type)}
              </div>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 dark:text-white">
                <Link href={`/user/${activity.userSlug}`} className="font-bold hover:underline">
                  {activity.userName}
                </Link>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {activity.action === "ADDED" ? t("added") : t("listed")}
                </span>{" "}
                <span className="font-medium text-gray-900 dark:text-white truncate">
                  {activity.itemName}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                  locale: dateLocale,
                })}
              </div>
            </div>

            {/* Item Image (Optional) */}
            {activity.itemImage && (
              <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 relative">
                <SafeImage
                  src={getSafeImageUrl(activity.itemImage)}
                  alt={activity.itemName}
                  fill
                  sizes="48px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
