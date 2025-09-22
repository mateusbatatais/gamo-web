// app/payment/success/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, Home } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("PaymentSuccess");

  const [paymentIntentId, setPaymentIntentId] = useState("");

  useEffect(() => {
    const paymentIntentIdParam = searchParams.get("paymentIntentId");

    if (paymentIntentIdParam) {
      setPaymentIntentId(paymentIntentIdParam);
    }
  }, [searchParams]);

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="text-green-500" size={80} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t("title")}</h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{t("message")}</p>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300">{t("impactMessage")}</p>
            {paymentIntentId && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                ID da transação: {paymentIntentId.slice(-8)}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleGoHome}
              icon={<Home size={16} />}
              className="flex-1"
            >
              {t("homeButton")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
