// app/site/console-catalog/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import ConsoleCatalogComponent from "@/components/organisms/_console/ConsoleCatalogComponent/ConsoleCatalogComponent";

const CatalogPageWrapper = () => {
  const searchParams = useSearchParams();
  // const brand = searchParams.get("brand") || "";
  const locale = useLocale();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "12", 10);

  return <ConsoleCatalogComponent locale={locale} page={page} perPage={perPage} />;
};

export default CatalogPageWrapper;
