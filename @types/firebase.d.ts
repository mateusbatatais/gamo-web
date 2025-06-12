// @types/firebase.d.ts
export interface FirebaseUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}
