// hooks/useGoogleLogin.ts
"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export const useGoogleLogin = () => {
  const login = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    return token;
  };

  return { login };
};
