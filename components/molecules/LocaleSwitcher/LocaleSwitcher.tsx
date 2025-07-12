// components/LocaleSwitcher/LocaleSwitcher.tsx
"use client";

import React, { useTransition } from "react";
import { useParams } from "next/navigation";
import { Locale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { Dropdown, DropdownItem } from "@/components/molecules/Dropdown/Dropdown";

export default function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale() as string;

  const localeItems: DropdownItem[] = routing.locales.map((locale) => ({
    id: locale,
    label: locale.toUpperCase(),
    onClick: () => handleLocaleChange(locale as Locale),
  }));

  function handleLocaleChange(nextLocale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error alinhamos pathname + params em tempo de build
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
      <Dropdown items={localeItems} label={currentLocale.toUpperCase()} variant="transparent" />
    </div>
  );
}
