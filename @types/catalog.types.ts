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
  platformIds: number[];
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
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
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

export interface GameStats {
  owned: number;
  playing: number;
  completed: number;
  abandoned: number;
}

export interface GameWithStats extends Game {
  stats?: GameStats;
}

export interface MarketItem {
  id: number;
  userId: number;
  userName: string;
  userSlug: string;
  price: number | null;
  image: string | null;
  sellerPhone: string | null;
  createdAt: Date;
  condition: string | null;
  hasBox: boolean | null;
  hasManual: boolean | null;
  status: "SELLING" | "LOOKING_FOR";
  acceptsTrade: boolean | null;
}

export interface MarketplaceItem {
  id: number;
  itemType: "GAME" | "CONSOLE" | "ACCESSORY" | "KIT";
  status: "SELLING" | "LOOKING_FOR";
  price: number | null;
  condition: string | null;
  hasBox: boolean;
  hasManual: boolean;
  acceptsTrade: boolean;
  photoMain: string | null;
  photos: string[];
  description: string | null;
  subtitle?: string;
  createdAt: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  name: string;
  slug: string;
  imageUrl: string;
  accessoryInfo?: {
    typeSlug: string;
    subTypeSlug: string;
  };
  kitInfo?: {
    itemCount: number;
    gamesCount: number;
    consolesCount: number;
    accessoriesCount: number;
    previewImages: string[];
  };
  seller: {
    id: number;
    name: string;
    slug: string;
    phone: string;
  };
  gamesCount?: number;
  accessoriesCount?: number;
}
