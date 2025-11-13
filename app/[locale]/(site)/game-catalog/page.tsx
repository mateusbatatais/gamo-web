"use client";

import { useSearchParams } from "next/navigation";
import GameCatalogComponent from "@/components/organisms/_game/GameCatalogComponent/GameCatalogComponent";

const GameCatalogPage = () => {
  const searchParams = useSearchParams();
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);

  return <GameCatalogComponent perPage={perPage} />;
};

export default GameCatalogPage;
