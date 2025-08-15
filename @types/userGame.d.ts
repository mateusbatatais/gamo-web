export interface GameFormData {
  description: string;
  status: "OWNED" | "SELLING" | "LOOKING_FOR";
  price: string;
  hasBox: boolean;
  hasManual: boolean;
  condition: "NEW" | "USED" | "REFURBISHED";
  acceptsTrade: boolean;
  progress: string;
  rating: string;
  review: string;
  abandoned: boolean;
  media: "PHYSICAL" | "DIGITAL";
}

export type UserGameUpdate = {
  description?: string;
  status?: "OWNED" | "SELLING" | "LOOKING_FOR";
  price?: number;
  hasBox?: boolean;
  hasManual?: boolean;
  condition?: "NEW" | "USED" | "REFURBISHED";
  acceptsTrade?: boolean;
  photoMain?: string | null;
  photos?: string[] | null;
};

export type UserGameInput = {
  consoleId: number;
  consoleVariantId: number;
  skinId?: number;
  description?: string;
  status: "OWNED" | "SELLING" | "LOOKING_FOR";
  price?: number;
  hasBox?: boolean;
  hasManual?: boolean;
  condition?: "NEW" | "USED" | "REFURBISHED";
  acceptsTrade?: boolean;
  photoMain?: string;
  photos?: string[];
  media: "PHYSICAL" | "DIGITAL";
  progress?: number;
  rating?: number;
  review?: string;
  abandoned?: boolean;
};
