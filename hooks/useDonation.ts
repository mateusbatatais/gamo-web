// hooks/useDonation.ts
"use client";

import { useState } from "react";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";

export interface CreateDonationRequest {
  amount: number;
  currency: string;
  email?: string;
  zipCode?: string;
}

export interface CreateDonationResponse {
  clientSecret: string;
  amount: number;
  paymentIntentId: string;
}

export interface ConfirmDonationRequest {
  paymentIntentId: string;
}

export function useDonation() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const createDonation = async (
    data: CreateDonationRequest,
  ): Promise<CreateDonationResponse | null> => {
    setIsLoading(true);

    try {
      return await apiFetch<CreateDonationResponse>("/donate/create-payment-intent", {
        method: "POST",
        body: data,
      });
    } catch (err) {
      console.error("Erro ao criar intenção de pagamento:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      showToast(`Erro ao processar doação: ${errorMessage}`, "danger");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDonation = async (data: ConfirmDonationRequest): Promise<boolean> => {
    setIsProcessingPayment(true);

    try {
      await apiFetch("/donate/confirm-payment", {
        method: "POST",
        body: data,
      });

      showToast("Doação realizada com sucesso! Obrigado pelo apoio.", "success");
      return true;
    } catch (err) {
      console.error("Erro ao confirmar pagamento:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      showToast(`Erro ao confirmar pagamento: ${errorMessage}`, "danger");
      return false;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return {
    createDonation,
    confirmDonation,
    isLoading,
    isProcessingPayment,
  };
}
