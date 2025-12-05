"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { useRandomConsoleNote } from "@/hooks/useConsoleNote";
import Link from "next/link";

export default function DiscoverySection() {
  const t = useTranslations("HomePage.discovery");
  const { data: note, isLoading, refetch, isRefetching } = useRandomConsoleNote();

  return (
    <section className="bg-indigo-900 rounded-2xl p-6 text-center relative overflow-hidden h-full flex flex-col justify-center">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center h-full">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-800 mb-4 text-yellow-400 shrink-0">
          <Lightbulb size={20} />
        </div>
        <h2 className="text-xl font-bold text-white mb-4">{t("title")}</h2>

        <div className="flex-1 flex flex-col justify-center items-center mb-6 w-full">
          {isLoading || isRefetching ? (
            <div className="animate-pulse flex flex-col items-center space-y-3 w-full">
              <div className="h-3 bg-indigo-800/50 rounded w-3/4"></div>
              <div className="h-3 bg-indigo-800/50 rounded w-1/2"></div>
            </div>
          ) : note ? (
            <>
              <p className="text-base text-indigo-100 mb-2 italic">&quot;{note.text}&quot;</p>
              <p className="text-xs text-indigo-300 font-medium">
                —{" "}
                <Link
                  href={`/console/${note.consoleSlug}`}
                  className="hover:text-white hover:underline transition-colors"
                >
                  {note.consoleName}
                </Link>
              </p>
            </>
          ) : (
            <p className="text-base text-indigo-100">{t("noFacts")}</p>
          )}
        </div>

        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="border-indigo-400 text-indigo-100 hover:bg-indigo-800 hover:text-white w-full"
          icon={<RefreshCw size={14} className={`mr-2 ${isRefetching ? "animate-spin" : ""}`} />}
          disabled={isLoading || isRefetching}
        >
          {t("refresh")}
        </Button>
      </div>
    </section>
  );
}
