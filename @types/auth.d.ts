// @types/auth.d.ts
export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin";
}
