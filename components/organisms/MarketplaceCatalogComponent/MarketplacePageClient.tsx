"use client";

import { useSearchParams } from "next/navigation";
import MarketplaceCatalogComponent from "@/components/organisms/MarketplaceCatalogComponent/MarketplaceCatalogComponent";

const MarketplacePageClient = () => {
  const searchParams = useSearchParams();
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);

  return <MarketplaceCatalogComponent perPage={perPage} />;
};

export default MarketplacePageClient;
