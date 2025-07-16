// types/publicProfile.d.ts
export interface PublicUserProfile {
  id: number;
  name: string;
  slug: string;
  profileImage: string | null;
  description: string | null;
}

export interface UserConsolePublic {
  id: number;
  consoleId: number;
  consoleName: string;
  variantName: string;
  skinName: string | null;
  customSkin: string | null;
  description: string | null;
  status: Status;
  price: number | null;
  hasBox: boolean | null;
  hasManual: boolean | null;
  condition?: "NEW" | "USED" | "REFURBISHED";
  acceptsTrade: boolean | null;
  photoMain: string | null;
  photos: string[] | null;
  createdAt: Date;
}

export interface ConsoleStatus {
  Status: "PUBLISHED" | "SELLING" | "SOLD" | "ARCHIVED";
}
