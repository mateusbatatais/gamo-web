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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar se estamos retornando de um redirecionamento 3D Secure
  useEffect(() => {
    if (!stripe) return;

    const clientSecret = searchParams.get("payment_intent_client_secret");

    if (clientSecret) {
      setIsSubmitting(true);
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        setIsSubmitting(false);

        if (paymentIntent) {
          switch (paymentIntent.status) {
            case "succeeded":
              setMessage(t("paymentSucceeded"));
              // Pequeno delay para mostrar a mensagem de sucesso
              setTimeout(() => onSuccess(), 1500);
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

    setIsSubmitting(true);
    setMessage(null);

    try {
      // URL para onde o usuário será redirecionado após autenticação 3D Secure
      const returnUrl = `${window.location.origin}${window.location.pathname}?donation=processing`;

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

      if (billing.phone) {
        billingDetails.phone = billing.phone;
      }

      if (billing.country || billing.postalCode) {
        billingDetails.address = {
          country: billing.country || "BR",
          postal_code: billing.postalCode || "",
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
    } catch (error) {
      setMessage(t("paymentError"));
      console.error("Erro ao processar pagamento:", error);
    } finally {
      setIsSubmitting(false);
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
        }}
      />

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.includes("sucesso") || message.includes("sucesso")
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-yellow-50 border border-yellow-200 text-yellow-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isProcessing}
        >
          {t("cancelButton")}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!stripe || isSubmitting || isProcessing}
          loading={isSubmitting || isProcessing}
        >
          {isSubmitting || isProcessing
            ? t("processingButton")
            : t("donateButton", { amount: amount.toFixed(2) })}
        </Button>
      </div>
    </form>
  );
}
