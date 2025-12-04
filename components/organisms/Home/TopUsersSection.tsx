"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useTopUsers } from "@/hooks/useTopUsers";
import UserMosaicCard from "@/components/molecules/UserMosaicCard/UserMosaicCard";

interface TopUsersSectionProps {
  type: "COLLECTION" | "SELLING";
}

export default function TopUsersSection({ type }: TopUsersSectionProps) {
  const t = useTranslations(
    type === "COLLECTION" ? "HomePage.topCollectors" : "HomePage.topSellers",
  );
  const { data: users, isLoading } = useTopUsers(type);

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!users || users.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
        {/* Optional: Link to a full leaderboard page if it exists */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {users.map((user, index) => (
          <UserMosaicCard key={user.id} user={user} rank={index + 1} type={type} />
        ))}
      </div>
    </section>
  );
}
