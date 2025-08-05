// game.d.ts
export interface GameListResponse {
  items: GameListItem[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface GameListItem {
  id: number;
  name: string; // Alterado de title para name
  slug: string;
  imageUrl: string | null;
  releaseDate: string | null;
  platforms: number[]; // Agora é array de IDs
  parentPlatforms: number[]; // Agora é array de IDs
  genres: number[]; // Agora é array de IDs
  developer?: string;
  description?: string; // Novo campo
  metacritic?: number | null; // Novo campo opcional
  shortScreenshots?: string[]; // Novo campo opcional
}

export interface MinimalGame {
  id: number;
  name: string;
  imageUrl?: string | null;
  slug: string;
}

export interface GameDetails {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  releaseDate: string | null;
  metacritic: number | null;
  score: number | null;
  externalId: string | null;
  imageUrl: string | null;
  dominantColor: string | null;
  saturatedColor: string | null;
  year: number | null;
  genres: number[];
  parentPlatforms: number[];
  platforms: number[];
  tags: number[];
  shortScreenshots: string[];
  esrbRating: string | null;
  children?: MinimalGame[];
  parents?: MinimalGame[];
  series?: SeriesResponse | null;
}

export interface GameWithStats extends GameDetails {
  beaten?: number;
  dropped?: number;
  owned?: number;
  playing?: number;
}

export interface SeriesResponse {
  id: number;
  name: string;
  slug: string;
  games: MinimalGame[];
}
