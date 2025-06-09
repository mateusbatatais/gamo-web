// components/LocaleSwitcher/LocaleSwitcher.tsx
"use client";

import React, { useTransition } from "react";
import { useParams } from "next/navigation";
import { Locale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { Dropdown, DropdownOption } from "@/components/atoms/Dropdown/Dropdown";

export default function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale() as string;

  // Mapeia os locais para o formato que o Dropdown espera
  const options: DropdownOption[] = routing.locales.map((cur) => ({
    value: cur,
    label: cur.toUpperCase(),
  }));

  function handleChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error alinhamos pathname + params em tempo de build
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <Dropdown
      options={options}
      selected={locale}
      onChange={handleChange}
      placeholder="Idioma"
      className={isPending ? "opacity-50 pointer-events-none" : ""}
    />
  );
}
