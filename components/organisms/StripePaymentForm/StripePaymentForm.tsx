// components/organisms/StripePaymentForm/StripePaymentForm.tsx
"use client";

import React from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";

type StripeBilling = {
  email?: string;
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
  billing?: StripeBilling;
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const billingAddress =
      billing?.country || billing?.postalCode
        ? {
            country: billing?.country, // ex: "BR"
            postal_code: billing?.postalCode,
          }
        : undefined;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            email: billing?.email,
            name: billing?.name,
            phone: billing?.phone,
            address: billingAddress,
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Erro no pagamento:", error);
      alert(error.message);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
          defaultValues: {
            billingDetails: {
              email: billing?.email ?? "",
              name: billing?.name,
              phone: billing?.phone,
              address: {
                country: billing?.country,
                postal_code: billing?.postalCode,
              },
            },
          },
        }}
      />

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
