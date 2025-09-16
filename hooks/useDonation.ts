// hooks/useDonation.ts
"use client";

import { useState } from "react";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";

export interface CreateDonationRequest {
  amount: number;
  currency: string;
  email?: string;
}

export interface CreateDonationResponse {
  clientSecret: string;
  amount: number;
}

export function useDonation() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createDonation = async (
    data: CreateDonationRequest,
  ): Promise<CreateDonationResponse | null> => {
    setIsLoading(true);

    try {
      const response = await apiFetch<CreateDonationResponse>("/donate/create-payment-intent", {
        method: "POST",
        body: data,
      });

      showToast("Pagamento processado com sucesso!", "success");
      return response;
    } catch (err) {
      console.error("Erro ao processar doação:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      showToast(`Erro ao processar doação: ${errorMessage}`, "danger");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createDonation,
    isLoading,
  };
}
