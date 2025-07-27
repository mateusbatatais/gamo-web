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
  genres: number[]; // Agora é array de IDs
  developer?: string;
  description?: string; // Novo campo
  // Removido translations
}
