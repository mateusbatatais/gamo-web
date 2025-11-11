"use client";

import Image from "next/image";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Props = {
  isScrolled: boolean;
};

export default function HeaderLogo({ isScrolled }: Props) {
  const t = useTranslations("Header");

  return (
    <Link
      href="/"
      className={clsx(
        "text-2xl font-bold text-gray-800 dark:text-gray-100 flex-shrink-0 transition-all",
        isScrolled ? "w-10" : "w-32",
      )}
    >
      {isScrolled ? (
        <Image
          src="/images/icon-gamo.svg"
          alt={t("altLogo")}
          className="h-auto w-full"
          width={130}
          height={40}
          priority={true}
        />
      ) : (
        <Image
          src="/images/logo-gamo.svg"
          alt={t("altLogo")}
          className="h-auto w-full"
          width={130}
          height={40}
          priority={true}
        />
      )}
    </Link>
  );
}
