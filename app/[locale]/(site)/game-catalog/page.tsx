"use client";

import { useSearchParams } from "next/navigation";
import GameCatalogComponent from "@/components/organisms/GameCatalogComponent/GameCatalogComponent";

const GameCatalogPage = () => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);

  return <GameCatalogComponent page={page} perPage={perPage} />;
};

export default GameCatalogPage;
