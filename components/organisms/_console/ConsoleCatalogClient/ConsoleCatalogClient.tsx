"use client";

import { useSearchParams } from "next/navigation";
import ConsoleCatalogComponent from "../ConsoleCatalogComponent/ConsoleCatalogComponent";

interface ConsoleCatalogClientProps {
  locale: string;
}

const ConsoleCatalogClient = ({ locale }: ConsoleCatalogClientProps) => {
  const searchParams = useSearchParams();
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);

  return <ConsoleCatalogComponent locale={locale} perPage={perPage} />;
};

export default ConsoleCatalogClient;
