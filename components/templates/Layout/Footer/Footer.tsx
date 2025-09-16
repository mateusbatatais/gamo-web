// components/templates/Layout/Footer/Footer.tsx
"use client";

import { Link } from "@/i18n/navigation";
import { CircleDollarSignIcon } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { useModalUrl } from "@/hooks/useModalUrl";
import { useTranslations } from "next-intl";
import { useRandomDonationPhrase } from "@/hooks/useRandomDonationPhrase";

export default function Footer() {
  const { openModal } = useModalUrl("donation");
  const t = useTranslations("Footer");
  const randomPhrase = useRandomDonationPhrase();

  return (
    <footer className="bg-gray-800 text-gray-200 dark:bg-gray-900 dark:text-gray-400">
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">
          © {new Date().getFullYear()} GAMO. {t("rightsReserved")}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={"/terms"}
            className="hover:underline dark:text-gray-300 dark:hover:text-gray-100"
          >
            {t("terms")}
          </Link>
          <Link
            href={"/privacy"}
            className="hover:underline dark:text-gray-300 dark:hover:text-gray-100"
          >
            {t("privacy")}
          </Link>
          <Link
            href={"/contact"}
            className="hover:underline dark:text-gray-300 dark:hover:text-gray-100"
          >
            {t("contact")}
          </Link>
          <Link
            href={"/about"}
            className="hover:underline dark:text-gray-300 dark:hover:text-gray-100"
          >
            {t("about")}
          </Link>
        </div>
        <Button
          variant="transparent"
          size="sm"
          onClick={openModal}
          className="text-yellow-400 hover:text-yellow-300 dark:text-yellow-300 dark:hover:text-yellow-200 flex items-center gap-1"
          title={randomPhrase}
          icon={<CircleDollarSignIcon size={20} />}
        >
          {randomPhrase}
        </Button>
      </div>
    </footer>
  );
}
