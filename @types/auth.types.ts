export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin";
}

export interface UserProfile {
  id: number;
  name: string;
  slug: string;
  email: string;
  description?: string;
  profileImage?: string;
}

export interface PublicUserProfile {
  id: number;
  name: string;
  slug: string;
  phone?: string | null;
  profileImage: string | null;
  description: string | null;
  accessoriesFavorited: number;
  accessoriesLookingFor: number;
  accessoriesSelling: number;
  accessoriesTotal: number;
  consolesFavorited: number;
  consolesLookingFor: number;
  consolesSelling: number;
  consolesTotal: number;
  gamesAbandoned: number;
  gamesFavorited: number;
  gamesFinished: number;
  gamesInProgress: number;
  gamesLookingFor: number;
  gamesSelling: number;
  gamesTotal: number;
  gamesRated: number;
  gamesReviewed: number;
  memberSince: string;
  gamesByGenre: {
    actionAdventure: number;
    sports: number;
    racing: number;
    fighting: number;
    shooter: number;
  };
}

export type AuthProvider = "Google" | "Microsoft";
