"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Avatar } from "@mui/material"; // Using MUI Avatar for now as I don't see a custom one
import { Star, Trophy, Activity } from "lucide-react";

export default function CommunitySpotlight() {
  const t = useTranslations("HomePage.community");

  // Mock Data
  const featuredCollector = {
    name: "RetroMaster99",
    title: "The Nintendo King",
    avatar: "/images/avatars/1.jpg", // Placeholder
    collectionCount: 452,
    rareItems: 12,
  };

  const activities = [
    { id: 1, user: "Alex", action: "added", item: "Super Mario World", time: "2m ago" },
    { id: 2, user: "Sarah", action: "listed", item: "PlayStation 5", time: "15m ago" },
    { id: 3, user: "Mike", action: "completed", item: "Zelda: Ocarina of Time", time: "1h ago" },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {/* Featured Collector */}
      <div className="md:col-span-1 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Trophy size={64} />
        </div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="fill-white" /> {t("title")}
        </h3>
        <div className="flex flex-col items-center text-center">
          <Avatar
            src={featuredCollector.avatar}
            alt={featuredCollector.name}
            sx={{ width: 80, height: 80, border: "4px solid white", marginBottom: 2 }}
          />
          <h4 className="text-2xl font-bold">{featuredCollector.name}</h4>
          <p className="text-yellow-100 mb-4">{featuredCollector.title}</p>

          <div className="flex gap-4 w-full justify-center bg-white/10 rounded-lg p-3">
            <div>
              <div className="font-bold text-xl">{featuredCollector.collectionCount}</div>
              <div className="text-xs text-yellow-100">Items</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="font-bold text-xl">{featuredCollector.rareItems}</div>
              <div className="text-xs text-yellow-100">Rares</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <Activity className="text-blue-500" /> {t("activityFeed")}
        </h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">{activity.user}</span>{" "}
                {activity.action}{" "}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {activity.item}
                </span>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
