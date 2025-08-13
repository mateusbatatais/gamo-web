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
  isFavorite?: boolean;
}

interface ConsoleVariantDetail {
  id: number;
  consoleId: number;
  slug: string;
  brand: { id: number; slug: string };
  generation?: number | null;
  type: string | null;
  releaseDate: string | null;
  name: string;
  consoleName: string;
  consoleDescription: string | null;
  imageUrl: string | null;
  launchDate: string | null;
  storage: string | null;
  skins: SkinDetail[];
}

interface SkinDetail {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  editionName: string | null;
  releaseDate: string | null;
  limitedEdition: boolean | null;
  material: string | null;
  finish: string | null;
  imageUrl: string | null;
}
