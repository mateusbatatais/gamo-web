"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { useRandomConsoleNote } from "@/hooks/useConsoleNote";

export default function DiscoverySection() {
  const t = useTranslations("HomePage.discovery");
  const { data: note, isLoading, refetch, isRefetching } = useRandomConsoleNote();

  return (
    <section className="py-8">
      <div className="bg-indigo-900 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-800 mb-6 text-yellow-400">
            <Lightbulb size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{t("title")}</h2>

          <div className="min-h-32 flex flex-col justify-center items-center mb-8">
            {isLoading || isRefetching ? (
              <div className="animate-pulse flex flex-col items-center space-y-3 w-full">
                <div className="h-4 bg-indigo-800/50 rounded w-3/4"></div>
                <div className="h-4 bg-indigo-800/50 rounded w-1/2"></div>
              </div>
            ) : note ? (
              <>
                <p className="text-lg md:text-xl text-indigo-100 mb-2">&quot;{note.text}&quot;</p>
                <p className="text-sm text-indigo-300 font-medium">— {note.consoleName}</p>
              </>
            ) : (
              <p className="text-lg md:text-xl text-indigo-100">{t("noFacts")}</p>
            )}
          </div>

          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-indigo-400 text-indigo-100 hover:bg-indigo-800 hover:text-white"
            icon={<RefreshCw size={16} className={`mr-2 ${isRefetching ? "animate-spin" : ""}`} />}
            disabled={isLoading || isRefetching}
          >
            {t("refresh")}
          </Button>
        </div>
      </div>
    </section>
  );
}
