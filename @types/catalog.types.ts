// Base para itens do catálogo
interface BaseCatalogItem {
  id: number;
  slug: string;
  name: string;
  imageUrl: string | null;
  releaseDate?: string | null;
  isFavorite?: boolean;
}

// Console
export interface ConsoleVariant extends BaseCatalogItem {
  consoleId: number;
  brand: { id: number; slug: string };
  consoleName: string;
  consoleDescription: string;
  storage?: string | null;
  skins: SkinDetail[];
  storageOptions: StorageOption[];
  allDigital: boolean;
  retroCompatible: boolean;
  mediaFormats: MediaFormat[];
  notes: { id: number; text: string }[];
}

// Jogo
export interface Game extends BaseCatalogItem {
  platforms: number[];
  parentPlatforms: number[];
  genres?: number[];
  developer?: string;
  description?: string;
  metacritic?: number | null;
  shortScreenshots?: string[];
  orientation?: "vertical" | "horizontal";
  genreMap?: Record<number, string>;
}

// Skin de console
export interface SkinDetail {
  id: number;
  slug: string;
  name: string;
  editionName?: string | null;
  limitedEdition?: boolean | null;
  material?: string | null;
  finish?: string | null;
  imageUrl?: string | null;
}

// Respostas paginadas
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface GameWithStats extends Game {
  esrbRating: string;
  score: number;
  year: number;
  series: {
    games: Game[];
    slug?: string;
    name?: string;
  } | null;
  children: Game[];
  parents: Game[];
}

export interface StorageOption {
  id: number;
  value: number;
  unit: string;
  note: string | null;
}

export interface MediaFormat {
  slug: string;
  name: string;
  id: number;
}

export interface Accessory {
  id: number;
  slug: string;
  type: string;
  subType?: string;
  name: string;
  imageUrl?: string;
  isFavorite?: boolean;
}

export interface CompatibleConsole {
  id: number;
  name: string;
  slug: string;
}

export interface AccessoryDetail extends BaseCatalogItem {
  type: string;
  subType?: string;
  description?: string;
  releaseDate?: string;
  consoles: CompatibleConsole[];
  variants: AccessoryVariantDetail[];
  isFavorite?: boolean;
}

export interface AccessoryVariantDetail {
  id: number;
  accessoryId: number;
  slug: string;
  name: string;
  description?: string;
  editionName?: string;
  imageUrl?: string;
  limitedEdition: boolean;
  releaseDate?: string;
  material?: string;
  finish?: string;
  type?: string;
}
