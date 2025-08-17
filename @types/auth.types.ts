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
  profileImage: string | null;
  description: string | null;
}

export type AuthProvider = "Google" | "Microsoft";
