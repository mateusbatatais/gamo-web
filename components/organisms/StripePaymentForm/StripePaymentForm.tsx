// components/organisms/StripePaymentForm/StripePaymentForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

type StripeBilling = {
  email: string;
  name?: string;
  phone?: string;
  country?: string;
  postalCode?: string;
};

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  isProcessing: boolean;
  billing: StripeBilling;
}

export function StripePaymentForm({
  amount,
  onSuccess,
  onCancel,
  isProcessing,
  billing,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations("StripePaymentForm");
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  // Verificar se estamos retornando de um redirecionamento 3D Secure
  useEffect(() => {
    if (!stripe) return;

    const clientSecret = searchParams.get("payment_intent_client_secret");

    if (clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent) {
          switch (paymentIntent.status) {
            case "succeeded":
              setMessage(t("paymentSucceeded"));
              onSuccess();
              break;
            case "processing":
              setMessage(t("paymentProcessing"));
              break;
            case "requires_payment_method":
              setMessage(t("paymentFailed"));
              break;
            default:
              setMessage(t("paymentError"));
              break;
          }
        }
      });
    }
  }, [stripe, searchParams, onSuccess, t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setMessage(null);

    // URL para onde o usuário será redirecionado após autenticação 3D Secure
    const returnUrl = `${window.location.origin}${window.location.pathname}?donation=processing`;

    // Configuração do endereço de cobrança
    const billingDetails: {
      email: string;
      name: string;
      phone?: string;
      address?: {
        country?: string;
        postal_code?: string;
        state?: string;
        city?: string;
        line1?: string;
      };
    } = {
      email: billing.email,
      name: billing.name || "Cliente",
    };

    // Adicionar telefone se disponível
    if (billing.phone) {
      billingDetails.phone = billing.phone;
    }

    // Adicionar endereço se disponível
    if (billing.country || billing.postalCode) {
      billingDetails.address = {
        country: billing.country || "BR",
        postal_code: billing.postalCode || "",
        state: "", // Estado (ex: "SP")
        city: "", // Cidade
        line1: "", // Endereço linha 1
      };
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        payment_method_data: {
          billing_details: billingDetails,
        },
      },
      redirect: "always",
    });

    if (error) {
      setMessage(error.message || t("paymentError"));
      console.error("Erro no pagamento:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
          fields: {
            billingDetails: {
              name: "auto",
              email: "auto",
              phone: "auto",
              address: "auto",
            },
          },
          defaultValues: {
            billingDetails: {
              email: billing.email,
              name: billing.name || "",
              phone: billing.phone || "",
              address: {
                country: billing.country || "BR",
                postal_code: billing.postalCode || "",
              },
            },
          },
        }}
      />

      {message && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          {message}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
          {t("cancelButton")}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!stripe || isProcessing}
          loading={isProcessing}
        >
          {isProcessing ? t("processingButton") : t("donateButton", { amount: amount.toFixed(2) })}
        </Button>
      </div>
    </form>
  );
}
