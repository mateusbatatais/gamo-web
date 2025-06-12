// app/site/catalog/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import CatalogComponent from "@/components/organisms/Catalog/Catalog";

const CatalogPageWrapper = () => {
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand") || "";
  const locale = useLocale();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "6", 10);
  const totalPages = 10; // Este valor pode vir de uma API ou ser calculado a partir dos dados

  return (
    <CatalogComponent
      brand={brand}
      locale={locale}
      page={page}
      perPage={perPage}
      totalPages={totalPages}
    />
  );
};

export default CatalogPageWrapper;
