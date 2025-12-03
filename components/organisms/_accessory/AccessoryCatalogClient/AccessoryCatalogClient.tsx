"use client";

import { useSearchParams } from "next/navigation";
import AccessoryCatalogComponent from "../AccessoryCatalogComponent/AccessoryCatalogComponent";

interface AccessoryCatalogClientProps {
  locale: string;
}

const AccessoryCatalogClient = ({ locale }: AccessoryCatalogClientProps) => {
  const searchParams = useSearchParams();
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);

  return <AccessoryCatalogComponent locale={locale} perPage={perPage} />;
};

export default AccessoryCatalogClient;
