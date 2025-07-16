export type UserConsoleUpdate = {
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
