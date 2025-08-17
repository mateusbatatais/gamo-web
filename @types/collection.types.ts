export type CollectionStatus = "OWNED" | "SELLING" | "LOOKING_FOR";
export type MediaType = "PHYSICAL" | "DIGITAL";
export type Condition = "NEW" | "USED" | "REFURBISHED";

// Base para consoles/jogos na coleção
interface BaseCollectionItem {
  id?: number;
  description?: string | null;
  status: CollectionStatus;
  price?: number | null;
  hasBox?: boolean | null;
  hasManual?: boolean | null;
  condition?: Condition;
  acceptsTrade?: boolean | null;
  photoMain?: string | null;
  photos?: string[] | null;
  createdAt?: Date;
}

// Console na coleção do usuário
export interface UserConsole extends BaseCollectionItem {
  consoleId: number;
  consoleVariantId: number;
  skinId?: number | null;
  consoleName?: string;
  variantName?: string;
  skinName?: string | null;
  customSkin?: string | null;
  user?: {
    id: number;
    name: string;
    slug: string;
    profileImage: string | null;
  };
}

// Jogo na coleção do usuário
export interface UserGame extends BaseCollectionItem {
  gameId: number;
  media: MediaType;
  rating?: number | null;
  progress?: number | null;
  review?: string | null;
  abandoned?: boolean | null;
  gameTitle?: string;
  gameImageUrl?: string;
}
