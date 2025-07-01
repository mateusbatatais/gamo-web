// @types/console.d.ts

export interface ConsoleVariantsResponse {
  items: ConsoleVariant[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface ConsoleVariant {
  id: number;
  slug: string;
  brand: { id: number; slug: string };
  name: string;
  consoleName: string;
  consoleDescription: string;
  imageUrl: string;
  releaseDate?: string | null;
  storage?: string | null;
  skins: SkinDetail[];
}

export interface SkinDetail {
  id: number;
  slug: string;
  name: string;
  imageUrl: string | null;
}
