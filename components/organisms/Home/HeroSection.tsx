"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@/navigation";
import { Wallet, Gamepad2, Library } from "lucide-react";

import { useUserStats } from "@/hooks/useUserStats";

export default function HeroSection() {
  const t = useTranslations("HomePage.hero");
  const { user } = useAuth();
  const { data: stats, isLoading } = useUserStats();

  if (user) {
    return (
      <section className="relative bg-linear-to-r from-blue-600 to-purple-700 text-white rounded-3xl overflow-hidden shadow-xl mb-8">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 p-4 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">
              {t("welcomeBack", { name: user.name.split(" ")[0] })}
            </h1>
            <p className="text-blue-100 max-w-md">{t("subtitle")}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href={`/user/${user.slug}`}
                className="inline-flex items-center justify-center font-medium rounded transition-colors cursor-pointer gap-2 leading-none px-5 py-4 text-lg bg-secondary-500 text-white border border-transparent hover:bg-secondary-600"
              >
                {t("viewCollection")}
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex flex-col items-center justify-center text-center min-w-[80px]">
              <Gamepad2 className="w-6 h-6 mb-2 text-green-300" />
              <span className="text-xs text-blue-100">{t("games")}</span>
              <span className="text-lg font-bold">{isLoading ? "..." : stats?.games || 0}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex flex-col items-center justify-center text-center min-w-[80px]">
              <Library className="w-6 h-6 mb-2 text-purple-300" />
              <span className="text-xs text-blue-100">{t("consoles")}</span>
              <span className="text-lg font-bold">{isLoading ? "..." : stats?.consoles || 0}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex flex-col items-center justify-center text-center min-w-[80px]">
              <Wallet className="w-6 h-6 mb-2 text-blue-300" />
              <span className="text-xs text-blue-100">{t("accessories")}</span>
              <span className="text-lg font-bold">
                {isLoading ? "..." : stats?.accessories || 0}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-3xl mb-12 bg-gray-900">
      {/* Background Gradient & Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-black" />
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20" />

      {/* Floating Elements (CSS Animation would go here) */}
      <div className="absolute top-10 left-10 opacity-20 animate-pulse">
        <Gamepad2 size={64} className="text-purple-500" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 animate-pulse delay-700">
        <Library size={64} className="text-blue-500" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
          {t("title")}
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">{t("subtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center font-medium rounded transition-colors cursor-pointer gap-2 leading-none w-full sm:w-auto text-lg px-8 py-6 bg-primary-500 text-white border border-transparent hover:bg-primary-600"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
