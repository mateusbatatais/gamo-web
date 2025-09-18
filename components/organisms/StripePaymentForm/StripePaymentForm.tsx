// components/organisms/StripePaymentForm/StripePaymentForm.tsx
"use client";

import React from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export function StripePaymentForm({
  amount,
  onSuccess,
  onCancel,
  isProcessing,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations("StripePaymentForm");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donation/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Erro no pagamento:", error);
      alert(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t("donationAmount", { amount: (amount / 100).toFixed(2) })}
        </h3>
      </div>

      <PaymentElement
        options={{
          layout: "tabs",
          defaultValues: {
            billingDetails: {
              email: "",
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
          {isProcessing
            ? t("processingButton")
            : t("donateButton", { amount: (amount / 100).toFixed(2) })}
        </Button>
      </div>
    </form>
  );
}
