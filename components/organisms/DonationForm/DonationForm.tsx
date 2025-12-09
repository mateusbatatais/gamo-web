"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { CreditCard, ArrowLeft, Copy, Check, Heart, ShieldCheck } from "lucide-react";
import { useDonation } from "@/hooks/useDonation";
import { StripePaymentForm } from "@/components/organisms/StripePaymentForm/StripePaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { useStripe } from "@/contexts/StripeContext";
import { useToast } from "@/contexts/ToastContext";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

type DonationStep = "paymentMethod" | "amount" | "stripe" | "pix";

// PIX static information
const PIX_INFO = {
  qrCode: "/images/qrcode.png",
  chave: "app.gamo.games@gmail.com",
  nome: "Mateus Severiano",
};

// Helpers
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const onlyDigits = (value: string) => value.replace(/\D/g, "");
const isValidZipCode = (zip: string) => /^\d{8}$/.test(onlyDigits(zip));
const isValidCpf = (value: string) => {
  const digits = onlyDigits(value);
  return digits.length === 11;
};

const formatZipCode = (value: string) => {
  let v = onlyDigits(value);
  if (v.length > 5) v = v.substring(0, 5) + "-" + v.substring(5, 8);
  return v;
};

const formatCpf = (value: string) => {
  let v = onlyDigits(value);
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  return v;
};

interface DonationFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  mode?: "modal" | "page";
  initialStep?: DonationStep;
}

export function DonationForm({
  onCancel,
  onSuccess,
  mode = "modal",
  initialStep = "paymentMethod",
}: DonationFormProps) {
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();
  const t = useTranslations("DonationModal");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cpf, setCpf] = useState("");
  const [step, setStep] = useState<DonationStep>(initialStep);
  const [paymentIntent, setPaymentIntent] = useState<{
    clientSecret: string;
    amount: number;
    id: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const { createDonation, confirmDonation, isLoading, isProcessingPayment } = useDonation();
  const { stripe } = useStripe();
  const { showToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.zipCode) setZipCode(user.zipCode);
  }, [user]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePaymentMethodSelect = (method: "stripe" | "pix") => {
    setStep(method === "stripe" ? "amount" : "pix");
  };

  const handleAmountSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    if (!user && !email) {
      showToast(t("emailRequired"), "danger");
      return;
    }

    if (!user && email && !isValidEmail(email)) {
      showToast(t("invalidEmail"), "danger");
      return;
    }

    if (!zipCode) {
      showToast(t("zipCodeRequired"), "danger");
      return;
    }

    if (!isValidZipCode(zipCode)) {
      showToast(t("invalidZipCode"), "danger");
      return;
    }

    if (cpf && !isValidCpf(cpf)) {
      showToast(t("invalidCpf"), "danger");
      return;
    }

    const result = await createDonation({
      amount: parseFloat(amount),
      currency: "BRL",
      email: user ? user.email : email,
      zipCode: onlyDigits(zipCode),
    });

    if (result) {
      setPaymentIntent({
        clientSecret: result.clientSecret,
        amount: result.amount,
        id: result.paymentIntentId,
      });
      setStep("stripe");
    }
  };

  const handlePixSuccess = async () => {
    if (onSuccess) onSuccess();
    setTimeout(() => {
      router.push(`/payment/success?paymentMethod=pix`);
    }, 100);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast(t("pixKeyCopied"), "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(t("pixKeyCopyError"), "danger");
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    const success = await confirmDonation({ paymentIntentId });
    if (success) {
      if (onSuccess) onSuccess();
      setTimeout(() => {
        router.push(
          `/payment/success?amount=${amount}&paymentIntentId=${paymentIntentId}&paymentMethod=stripe`,
        );
      }, 100);
    } else {
      showToast(t("paymentConfirmationError"), "danger");
      setStep("amount");
    }
  };

  const handleBackToPaymentMethod = () => {
    setStep("paymentMethod");
    setAmount("");
  };

  const handleBackToAmount = () => {
    setStep("amount");
    setPaymentIntent(null);
  };

  const suggestedAmounts = [10, 50, 100, 200, 500];
  const showEmailField = !user;
  const showZipCodeField = !user || (user && !user.zipCode);

  if (!isClient) return null;

  return (
    <div className="space-y-6">
      {/* Banner de Sobrevivência - Always show in page mode, or if specifically requested */}
      <div
        className={clsx(
          "rounded-lg p-4 border flex gap-3 text-sm",
          "bg-amber-50 border-amber-200 text-amber-800",
          "dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200",
        )}
      >
        <Heart
          className="shrink-0 text-amber-600 dark:text-amber-400 fill-amber-600/20"
          size={20}
        />
        <div>
          <p className="font-semibold mb-1">{t("survivalTitle")}</p>
          <p className="opacity-90">{t("survivalMessage")}</p>
        </div>
      </div>

      {step === "paymentMethod" && (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">{t("description")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handlePaymentMethodSelect("stripe")}
              className={clsx(
                "p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-3 group",
                "border-gray-200 hover:border-blue-500 hover:bg-blue-50",
                "dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20",
              )}
            >
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 w-fit text-blue-600 dark:text-blue-300">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t("creditCard")}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("creditCardDescription")}
                </p>
              </div>
            </button>

            <button
              onClick={() => handlePaymentMethodSelect("pix")}
              className={clsx(
                "p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-3 group",
                "border-gray-200 hover:border-teal-500 hover:bg-teal-50",
                "dark:border-gray-700 dark:hover:border-teal-400 dark:hover:bg-teal-900/20",
              )}
            >
              <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900 w-fit text-teal-600 dark:text-teal-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  className="fill-current"
                >
                  <path d="M11.9,12h-0.68l8.04-8.04c2.62-2.61,6.86-2.61,9.48,0L36.78,12H36.1c-1.6,0-3.11,0.62-4.24,1.76l-6.8,6.77c-0.59,0.59-1.53,0.59-2.12,0l-6.8-6.77C15.01,12.62,13.5,12,11.9,12z" />
                  <path d="M36.1,36h0.68l-8.04,8.04c-2.62,2.61-6.86,2.61-9.48,0L11.22,36h0.68c1.6,0,3.11-0.62,4.24-1.76l6.8-6.77c0.59-0.59,1.53-0.59,2.12,0l6.8,6.77C32.99,35.38,34.5,36,36.1,36z" />
                  <path d="M44.04,28.74L38.78,34H36.1c-1.07,0-2.07-0.42-2.83-1.17l-6.8-6.78c-1.36-1.36-3.58-1.36-4.94,0l-6.8,6.78C13.97,33.58,12.97,34,11.9,34H9.22l-5.26-5.26c-2.61-2.62-2.61-6.86,0-9.48L9.22,14h2.68c1.07,0,2.07,0.42,2.83,1.17l6.8,6.78c0.68,0.68,1.58,1.02,2.47,1.02s1.79-0.34,2.47-1.02l6.8-6.78C34.03,14.42,35.03,14,36.1,14h2.68l5.26,5.26C46.65,21.88,46.65,26.12,44.04,28.74z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t("pix")}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("pixDescription")}
                </p>
              </div>
            </button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-center gap-3">
            <ShieldCheck className="text-blue-600 dark:text-blue-400" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t("paymentSecurity")}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {t("paymentSecurityDescription")}
              </p>
            </div>
          </div>

          {onCancel && mode === "modal" && (
            <Button variant="transparent" className="w-full mt-2" onClick={onCancel}>
              {t("cancelButton")}
            </Button>
          )}
        </div>
      )}

      {step === "amount" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="transparent"
              size="sm"
              onClick={handleBackToPaymentMethod}
              className="-ml-2"
            >
              <ArrowLeft size={16} className="mr-1" /> {t("backButton")}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {suggestedAmounts.map((suggestedAmount) => (
              <Button
                key={suggestedAmount}
                variant={amount === suggestedAmount.toString() ? "primary" : "outline"}
                onClick={() => setAmount(suggestedAmount.toString())}
                className="h-12 text-lg font-medium"
              >
                R$ {suggestedAmount}
              </Button>
            ))}
            <div className="col-span-3 md:col-span-1">
              <Input
                type="number"
                min="1"
                step="1"
                placeholder={t("customAmountPlaceholder")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-center text-lg"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4">
            {showEmailField && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("emailLabel")}
                </label>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showZipCodeField && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("zipCodeLabel")}
                  </label>
                  <Input
                    type="text"
                    placeholder={t("zipCodePlaceholder")}
                    value={zipCode}
                    onChange={(e) => setZipCode(formatZipCode(e.target.value))}
                    disabled={isLoading}
                    maxLength={9}
                    required
                  />
                  <p className="text-xs text-gray-500">{t("zipCodeHelp")}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("cpf")}
                </label>
                <Input
                  type="text"
                  placeholder={t("cpfPlaceholder")}
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  disabled={isLoading}
                  maxLength={14}
                />
                <p className="text-xs text-gray-500">{t("cpfHelp")}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button variant="transparent" onClick={onCancel} disabled={isLoading}>
                {t("cancelButton")}
              </Button>
            )}
            <Button
              onClick={handleAmountSubmit}
              className="w-full md:w-auto min-w-[150px]"
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
              loading={isLoading}
            >
              {t("continueButton")}
            </Button>
          </div>
        </div>
      )}

      {step === "stripe" && stripe && paymentIntent && (
        <div className="space-y-4">
          <Button
            variant="transparent"
            size="sm"
            onClick={handleBackToAmount}
            className="-ml-2 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" /> {t("backButton")}
          </Button>

          <Elements
            stripe={stripe}
            options={{
              clientSecret: paymentIntent.clientSecret,
              appearance: {
                theme: resolvedTheme === "dark" ? "night" : "stripe",
                variables: {
                  colorBackground: "transparent",
                  colorText: resolvedTheme === "dark" ? "#ffffff" : "#000000",
                  colorDanger: "#dc2626",
                },
              },
            }}
            key={resolvedTheme}
          >
            <StripePaymentForm
              amount={paymentIntent.amount}
              onSuccess={() => paymentIntent && handlePaymentSuccess(paymentIntent.id)}
              onCancel={handleBackToAmount}
              isProcessing={isProcessingPayment}
              billing={{
                email: (user?.email ?? email) || "",
                name: user?.name || "Gamo no name",
                phone: user?.phone || "",
                country: "BR",
                postalCode: onlyDigits(zipCode),
              }}
            />
          </Elements>
        </div>
      )}

      {step === "pix" && (
        <div className="space-y-6 text-center">
          <Button
            variant="transparent"
            size="sm"
            onClick={handleBackToPaymentMethod}
            className="absolute left-4 top-4"
          >
            <ArrowLeft size={16} />
          </Button>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
              {t("pixImportantNote")}
            </div>

            <div className="bg-white p-4 inline-block rounded-xl shadow-sm">
              <Image src={PIX_INFO.qrCode} alt={t("pixQrCodeAlt")} width={200} height={200} />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {t("pixKeyLabel")}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-lg border text-sm break-all font-mono">
                  {PIX_INFO.chave}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(PIX_INFO.chave)}
                  className="shrink-0"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </Button>
              </div>
              <p className="text-xs text-gray-400">{PIX_INFO.nome}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="transparent" onClick={handleBackToPaymentMethod}>
              {t("backButton")}
            </Button>
            <Button onClick={handlePixSuccess} className="bg-teal-600 hover:bg-teal-700 text-white">
              {t("pixConfirmedButton")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
