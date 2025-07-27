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
  title: string;
  slug: string;
  imageUrl: string | null;
  releaseDate: string | null;
  platforms: { id: number; name: string; slug: string }[];
  genres: { id: number; name: string; slug: string }[];
  developer?: string;
  translations: { locale: string; title: string }[];
}
