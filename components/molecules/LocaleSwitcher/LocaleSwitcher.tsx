"use client";

import React, { ChangeEvent, ReactNode, useTransition, forwardRef } from "react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { Locale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";
import { routing } from "@/i18n/routing";

type LocaleSwitcherProps = {
  /** Se você quiser customizar as opções manualmente, pode passar children */
  children?: ReactNode;
};

const sizeClasses = {
  root: "relative inline-block text-gray-700 dark:text-gray-200",
  select:
    "appearance-none block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50",
  icon: "pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 dark:text-gray-500",
};

export const LocaleSwitcher = forwardRef<HTMLSelectElement, LocaleSwitcherProps>(
  ({ children }, ref) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const params = useParams();
    const locale = useLocale();

    function onChange(e: ChangeEvent<HTMLSelectElement>) {
      const nextLocale = e.target.value as Locale;
      startTransition(() => {
        router.replace(
          // @ts-expect-error garantimos que params + pathname estejam alinhados
          { pathname, params },
          { locale: nextLocale },
        );
      });
    }

    return (
      <div className={sizeClasses.root}>
        <select
          ref={ref}
          onChange={onChange}
          disabled={isPending}
          defaultValue={locale}
          className={clsx(sizeClasses.select, isPending && "opacity-50")}
        >
          {children ??
            (typeof routing !== "undefined"
              ? routing.locales.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur.toUpperCase()}
                  </option>
                ))
              : null)}
        </select>
        <ChevronDown size={16} className={sizeClasses.icon} />
      </div>
    );
  },
);

LocaleSwitcher.displayName = "LocaleSwitcher";
