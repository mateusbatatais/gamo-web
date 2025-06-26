// src/hooks/useGoogleLogin.ts
"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const backendResponse = await apiFetch<{ token: string }>("/auth/social-login", {
        method: "POST",
        token: idToken,
      });

      login(backendResponse.token);

      router.push("/account");

      return backendResponse.token;
    } catch (error) {
      console.error("Google login failed:", error);
      throw new Error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading };
};
