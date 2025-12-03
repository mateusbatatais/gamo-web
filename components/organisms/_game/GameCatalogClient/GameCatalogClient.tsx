"use client";

import { useSearchParams } from "next/navigation";
import GameCatalogComponent from "../GameCatalogComponent/GameCatalogComponent";

const GameCatalogClient = () => {
  const searchParams = useSearchParams();
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);

  return <GameCatalogComponent perPage={perPage} />;
};

export default GameCatalogClient;
