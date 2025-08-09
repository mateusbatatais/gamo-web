"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Header from "@/components/templates/Layout/Header/Header";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Button } from "@/components/atoms/Button/Button";
import "../../../app/globals.scss";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const [randomImage, setRandomImage] = useState<string>("");

  const errorImages = [
    "/images/404/cg-fail.jpg",
    "/images/404/ps2-fail.jpg",
    "/images/404/xbox-fail.jpg",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * errorImages.length);
    setRandomImage(errorImages[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header></Header>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-8">
          {randomImage && (
            <div className="flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 relative rounded-xl overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg">
              <Image
                src={randomImage}
                alt={t("imageAlt")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={true}
              />
            </div>
          )}

          <div className="text-center md:text-left">
            <div className="mb-4">
              <Badge status="danger" variant="soft">
                ERROR: 404
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {t("title")}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">{t("description")}</p>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
              <Link href="/">
                <Button>{t("homeButton")}</Button>
              </Link>

              <Link href="/console-catalog">
                <Button variant="secondary">{t("GameCollectionButton")}</Button>
              </Link>

              <Link href="/console-games">
                <Button variant="secondary">{t("ConsoleollectionButton")}</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center max-w-xl">
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">{t("tip")}</p>
        </div>
      </div>
    </>
  );
}
