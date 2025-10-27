// hooks/account/useAccount.ts
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  name: string;
  slug: string;
  email: string;
  phone?: string | null;
  description?: string;
  profileImage?: string;
}

interface UpdateProfilePayload {
  name: string;
  slug: string;
  phone?: string | null;
  email: string;
  description: string;
  profileImage?: string;
}

export function useAccount() {
  const { apiFetch } = useApiClient();
  const { logout, login, refreshToken, updateUser } = useAuth();

  const profileQuery = useQuery<UserProfile>({
    queryKey: ["account", "profile"],
    queryFn: () => apiFetch("/user/profile"),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      return apiFetch<{
        token: string;
        user: UserProfile;
      }>("/user/profile", {
        method: "PUT",
        body: payload,
      });
    },
    onSuccess: (data) => {
      updateUser(data.user);
      refreshToken(data.token);
    },
  });

  const uploadProfileImage = useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData();
      formData.append("file", file, "profile.jpg");

      return apiFetch<{ url: string }>("/uploads/profile", {
        method: "POST",
        body: formData,
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (payload: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      return apiFetch("/user/profile/password", {
        method: "PUT",
        body: payload,
      });
    },
    onSuccess: () => {
      // Limpar os campos pode ser feito no onSuccess
    },
    onError: (error: { code?: string; message?: string }) => {
      if (error.code === "UNAUTHORIZED") {
        logout();
      }
      throw error; // Será tratado no componente
    },
  });

  const setInitialPasswordMutation = useMutation<
    { token: string }, // Tipo do retorno
    { code?: string; message?: string }, // Tipo do erro
    { newPassword: string; confirmNewPassword: string } // Tipo da payload
  >({
    mutationFn: async ({ newPassword, confirmNewPassword }) => {
      return apiFetch("/user/profile/initial-password", {
        method: "PUT",
        body: { newPassword, confirmNewPassword },
      });
    },
    onSuccess: (data) => {
      // Atualiza o token após sucesso
      login(data.token);
    },
    onError: (error) => {
      if (error.code === "UNAUTHORIZED") {
        logout();
      }
      throw error; // Será tratado no componente
    },
  });

  return {
    profileQuery,
    updateProfileMutation,
    uploadProfileImage,
    changePasswordMutation,
    setInitialPasswordMutation,
  };
}
