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
