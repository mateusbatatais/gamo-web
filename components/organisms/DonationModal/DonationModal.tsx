// components/organisms/DonationModal/DonationModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Coffee, CreditCard, ArrowLeft, Copy, Check } from "lucide-react";
import { useModalUrl } from "@/hooks/useModalUrl";
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
  return digits.length === 11; // simple length validation (same as previous behavior)
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

// Step-specific UI components
function PaymentMethodStep({
  t,
  onSelectStripe,
  onSelectPix,
}: {
  t: (k: string) => string;
  onSelectStripe: () => void;
  onSelectPix: () => void;
}) {
  return (
    <>
      <p className="text-sm text-gray-600 dark:text-gray-300">{t("description")}</p>

      <div className="grid gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onSelectStripe}
          className="justify-start p-4 h-auto"
          icon={<CreditCard size={30} />}
        >
          <div className="text-left">
            <div className="font-semibold">{t("creditCard")}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t("creditCardDescription")}
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onSelectPix}
          className="justify-start p-4 h-auto"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
              <path
                fill="#4db6ac"
                d="M11.9,12h-0.68l8.04-8.04c2.62-2.61,6.86-2.61,9.48,0L36.78,12H36.1c-1.6,0-3.11,0.62-4.24,1.76	l-6.8,6.77c-0.59,0.59-1.53,0.59-2.12,0l-6.8-6.77C15.01,12.62,13.5,12,11.9,12z"
              ></path>
              <path
                fill="#4db6ac"
                d="M36.1,36h0.68l-8.04,8.04c-2.62,2.61-6.86,2.61-9.48,0L11.22,36h0.68c1.6,0,3.11-0.62,4.24-1.76	l6.8-6.77c0.59-0.59,1.53-0.59,2.12,0l6.8,6.77C32.99,35.38,34.5,36,36.1,36z"
              ></path>
              <path
                fill="#4db6ac"
                d="M44.04,28.74L38.78,34H36.1c-1.07,0-2.07-0.42-2.83-1.17l-6.8-6.78c-1.36-1.36-3.58-1.36-4.94,0	l-6.8,6.78C13.97,33.58,12.97,34,11.9,34H9.22l-5.26-5.26c-2.61-2.62-2.61-6.86,0-9.48L9.22,14h2.68c1.07,0,2.07,0.42,2.83,1.17	l6.8,6.78c0.68,0.68,1.58,1.02,2.47,1.02s1.79-0.34,2.47-1.02l6.8-6.78C34.03,14.42,35.03,14,36.1,14h2.68l5.26,5.26	C46.65,21.88,46.65,26.12,44.04,28.74z"
              ></path>
            </svg>
          }
        >
          <div className="text-left">
            <div className="font-semibold">{t("pix")}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t("pixDescription")}</div>
          </div>
        </Button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <CreditCard size={16} />
          <span className="text-sm font-medium">{t("paymentSecurity")}</span>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          {t("paymentSecurityDescription")}
        </p>
      </div>
    </>
  );
}

function AmountStep({
  t,
  amount,
  setAmount,
  suggestedAmounts,
  showEmailField,
  email,
  setEmail,
  showZipCodeField,
  zipCode,
  onZipCodeChange,
  cpf,
  onCpfChange,
  onBack,
  isLoading,
}: {
  t: (k: string) => string;
  amount: string;
  setAmount: (v: string) => void;
  suggestedAmounts: number[];
  showEmailField: boolean;
  email: string;
  setEmail: (v: string) => void;
  showZipCodeField: boolean;
  zipCode: string;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cpf: string;
  onCpfChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  isLoading: boolean;
}) {
  return (
    <>
      <Button
        variant="transparent"
        size="sm"
        onClick={onBack}
        className="mb-2 flex items-center gap-1 text-gray-600 dark:text-gray-400"
        icon={<ArrowLeft size={16} />}
      >
        {t("backButton")}
      </Button>

      <p className="text-sm text-gray-600 dark:text-gray-300">{t("description")}</p>

      <div className="grid grid-cols-3 gap-2">
        {suggestedAmounts.map((suggestedAmount) => (
          <Button
            key={suggestedAmount}
            variant={amount === suggestedAmount.toString() ? "primary" : "outline"}
            size="sm"
            onClick={() => setAmount(suggestedAmount.toString())}
            className="justify-center py-2"
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
            className="text-center h-full"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-3">
        {showEmailField && (
          <div className="space-y-2">
            <label
              htmlFor="donation-email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("emailLabel")}
            </label>
            <Input
              id="donation-email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        )}
        <div className="flex gap-2">
          {showZipCodeField && (
            <div className="space-y-2 flex-1">
              <label
                htmlFor="donation-zipcode"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("zipCodeLabel")}
              </label>
              <Input
                id="donation-zipcode"
                type="text"
                placeholder={t("zipCodePlaceholder")}
                value={zipCode}
                onChange={onZipCodeChange}
                disabled={isLoading}
                maxLength={9}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("zipCodeHelp")}</p>
            </div>
          )}

          <div className="space-y-2 flex-1">
            <label
              htmlFor="donation-cpf"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("cpf")}
            </label>
            <Input
              id="donation-cpf"
              type="text"
              placeholder={t("cpfPlaceholder")}
              value={cpf}
              onChange={onCpfChange}
              disabled={isLoading}
              maxLength={14}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("cpfHelp")}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function StripeStep({
  t,
  stripe,
  paymentIntent,
  resolvedTheme,
  user,
  email,
  zipCode,
  isProcessingPayment,
  onSuccess,
  onCancel,
}: {
  t: (k: string) => string;
  stripe: import("@stripe/stripe-js").Stripe | null;
  paymentIntent: { clientSecret: string; amount: number; id: string } | null;
  resolvedTheme: string | undefined;
  user: { email?: string | null; name?: string | null; phone?: string | null } | null;
  email: string;
  zipCode: string;
  isProcessingPayment: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <Button
        variant="transparent"
        size="sm"
        onClick={onCancel}
        className="mb-2 flex items-center gap-1 text-gray-600 dark:text-gray-400"
        icon={<ArrowLeft size={16} />}
      >
        {t("backButton")}
      </Button>

      {stripe && paymentIntent && (
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
            onSuccess={onSuccess}
            onCancel={onCancel}
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
      )}
    </>
  );
}

function PixStep({
  t,
  copied,
  onCopy,
  onBack,
}: {
  t: (k: string) => string;
  copied: boolean;
  onCopy: (text: string) => void;
  onBack: () => void;
}) {
  return (
    <>
      <Button
        variant="transparent"
        size="sm"
        onClick={onBack}
        className="mb-2 flex items-center gap-1 text-gray-600 dark:text-gray-400"
        icon={<ArrowLeft size={16} />}
      >
        {t("backButton")}
      </Button>

      <div className="text-center space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">{t("pixImportantNote")}</p>
          </div>{" "}
          <div className="mb-4 bg-white p-4 inline-block rounded">
            <Image
              src={PIX_INFO.qrCode}
              alt={t("pixQrCodeAlt")}
              width={200}
              height={200}
              className="mx-auto max-w-[200px] h-auto"
            />
          </div>
          {/* Chave PIX */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("pixKeyLabel")}</p>
            <div className="bg-white dark:bg-gray-900 p-3 rounded border flex items-center justify-between">
              <code className="text-sm break-all">{PIX_INFO.chave}</code>
              <Button
                variant="transparent"
                size="sm"
                onClick={() => onCopy(PIX_INFO.chave)}
                icon={copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              />
            </div>
          </div>
          {/* Informações adicionais */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 space-y-1">
            <p>{PIX_INFO.nome}</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Main component
export function DonationModal() {
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();
  const t = useTranslations("DonationModal");
  const { isOpen, closeModal } = useModalUrl("donation");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cpf, setCpf] = useState("");
  const [step, setStep] = useState<DonationStep>("paymentMethod");
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

  // Preencher email/CEP se o usuário estiver logado
  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.zipCode) setZipCode(user.zipCode);
  }, [user]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handlers
  const handlePaymentMethodSelect = (method: "stripe" | "pix") => {
    setStep(method === "stripe" ? "amount" : "pix");
  };

  const handleAmountSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Validações apenas para Stripe
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

    // Validar CPF se fornecido (opcional)
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
    closeModal();
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
      closeModal();
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

  const handleCloseModal = () => {
    closeModal();
    setTimeout(() => {
      setStep("paymentMethod");
      setAmount("");
      setPaymentIntent(null);
      setCpf("");
    }, 300);
  };

  const suggestedAmounts = [10, 50, 100, 200, 500];
  const showEmailField = !user;
  const showZipCodeField = !user || (user && !user.zipCode);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(formatZipCode(e.target.value));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
  };

  if (!isClient) return null;

  const getTitleForStep = (s: DonationStep) => {
    switch (s) {
      case "paymentMethod":
        return t("title");
      case "amount":
      case "stripe":
        return t("paymentTitle");
      case "pix":
        return t("pixTitle");
    }
  };

  const getSubtitleForStep = (s: DonationStep) => {
    switch (s) {
      case "paymentMethod":
        return t("subtitle");
      case "amount":
      case "stripe":
        return t("paymentSubtitle");
      case "pix":
        return t("pixSubtitle");
    }
  };

  const getActionButtonsForStep = (s: DonationStep) => {
    if (s === "paymentMethod") {
      return {
        cancel: {
          label: t("cancelButton"),
          onClick: handleCloseModal,
        },
      } as const;
    }
    if (s === "amount") {
      return {
        cancel: {
          label: t("backButton"),
          onClick: handleBackToPaymentMethod,
        },
        confirm: {
          label: isLoading ? t("processingButton") : t("continueButton"),
          onClick: handleAmountSubmit,
          disabled: !amount || parseFloat(amount) <= 0 || isLoading,
          loading: isLoading,
        },
      } as const;
    }
    if (s === "pix") {
      return {
        cancel: {
          label: t("backButton"),
          onClick: handleBackToPaymentMethod,
        },
        confirm: {
          label: t("pixConfirmedButton"),
          onClick: handlePixSuccess,
        },
      } as const;
    }
    return undefined;
  };

  const renderStep = () => {
    switch (step) {
      case "paymentMethod":
        return (
          <PaymentMethodStep
            t={t}
            onSelectStripe={() => handlePaymentMethodSelect("stripe")}
            onSelectPix={() => handlePaymentMethodSelect("pix")}
          />
        );
      case "amount":
        return (
          <AmountStep
            t={t}
            amount={amount}
            setAmount={setAmount}
            suggestedAmounts={suggestedAmounts}
            showEmailField={showEmailField}
            email={email}
            setEmail={setEmail}
            showZipCodeField={showZipCodeField}
            zipCode={zipCode}
            onZipCodeChange={handleZipCodeChange}
            cpf={cpf}
            onCpfChange={handleCpfChange}
            onBack={handleBackToPaymentMethod}
            isLoading={isLoading}
          />
        );
      case "stripe":
        return (
          <StripeStep
            t={t}
            stripe={stripe}
            paymentIntent={paymentIntent}
            resolvedTheme={resolvedTheme}
            user={user}
            email={email}
            zipCode={zipCode}
            isProcessingPayment={isProcessingPayment}
            onSuccess={() => paymentIntent && handlePaymentSuccess(paymentIntent.id)}
            onCancel={handleBackToAmount}
          />
        );
      case "pix":
        return (
          <PixStep
            t={t}
            copied={copied}
            onCopy={copyToClipboard}
            onBack={handleBackToPaymentMethod}
          />
        );
    }
  };

  return (
    <Dialog
      modalId="donation"
      title={getTitleForStep(step)}
      subtitle={getSubtitleForStep(step)}
      onClose={handleCloseModal}
      icon={<Coffee className="text-yellow-500" />}
      size="md"
      actionButtons={getActionButtonsForStep(step)}
      open={isOpen}
    >
      <div className="space-y-4">{renderStep()}</div>
    </Dialog>
  );
}
