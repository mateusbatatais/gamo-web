// app/site/accessory-catalog/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import AccessoryCatalogComponent from "@/components/organisms/_accessory/AccessoryCatalogComponent/AccessoryCatalogComponent";

const AccessoryCatalogPageWrapper = () => {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "12", 10);

  return <AccessoryCatalogComponent locale={locale} page={page} perPage={perPage} />;
};

export default AccessoryCatalogPageWrapper;
