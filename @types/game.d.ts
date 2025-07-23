export interface GameListResponse {
  items: GameListItem[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface GameListItem {
  id: number;
  title: string;
  slug: string;
  imageUrl: string | null;
  releaseDate: string;
  platforms: string[];
  developer: string;
}
