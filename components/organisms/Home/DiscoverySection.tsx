"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";

export default function DiscoverySection() {
  const t = useTranslations("HomePage.discovery");

  const facts = [
    "The PlayStation 2 is the best-selling game console of all time, with over 155 million units sold.",
    "Nintendo was founded in 1889 as a playing card company.",
    "The first video game played in space was Tetris on a Game Boy.",
    "Pac-Man was invented by Toru Iwatani while he was eating pizza.",
  ];

  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const nextFact = () => {
    setCurrentFactIndex((prev) => (prev + 1) % facts.length);
  };

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
          <p className="text-lg md:text-xl text-indigo-100 mb-8 min-h-14">
            &quot;{facts[currentFactIndex]}&quot;
          </p>
          <Button
            onClick={nextFact}
            variant="outline"
            className="border-indigo-400 text-indigo-100 hover:bg-indigo-800 hover:text-white"
          >
            <RefreshCw size={16} className="mr-2" />
            {t("refresh")}
          </Button>
        </div>
      </div>
    </section>
  );
}
