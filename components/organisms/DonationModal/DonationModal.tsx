// components/organisms/DonationModal/DonationModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Coffee, CreditCard, ArrowLeft } from "lucide-react";
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

type DonationStep = "amount" | "payment";

export function DonationModal() {
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();
  const t = useTranslations("DonationModal");
  const { isOpen, closeModal } = useModalUrl("donation");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cpf, setCpf] = useState("");
  const [step, setStep] = useState<DonationStep>("amount");
  const [paymentIntent, setPaymentIntent] = useState<{
    clientSecret: string;
    amount: number;
    id: string;
  } | null>(null);

  const { createDonation, confirmDonation, isLoading, isProcessingPayment } = useDonation();
  const { stripe } = useStripe();
  const { showToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  // Preencher email se o usuário estiver logado
  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.zipCode) setZipCode(user.zipCode);
  }, [user]);

  const handleAmountSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Validações
    if (!user && !email) {
      showToast(t("emailRequired"), "danger");
      return;
    }

    if (!user && email && !/\S+@\S+\.\S+/.test(email)) {
      showToast(t("invalidEmail"), "danger");
      return;
    }

    if (!zipCode) {
      showToast(t("zipCodeRequired"), "danger");
      return;
    }

    // Validar formato do CEP (apenas números, 8 dígitos)
    const zipCodeRegex = /^\d{8}$/;
    const cleanZipCode = zipCode.replace(/\D/g, "");
    if (!zipCodeRegex.test(cleanZipCode)) {
      showToast(t("invalidZipCode"), "danger");
      return;
    }

    // Validar CPF se fornecido (opcional)
    if (cpf && cpf.replace(/\D/g, "").length !== 11) {
      showToast("CPF inválido", "danger");
      return;
    }

    const result = await createDonation({
      amount: parseFloat(amount),
      currency: "BRL",
      email: user ? user.email : email,
      zipCode: cleanZipCode,
    });

    if (result) {
      setPaymentIntent({
        clientSecret: result.clientSecret,
        amount: result.amount,
        id: result.paymentIntentId,
      });
      setStep("payment");
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    const success = await confirmDonation({ paymentIntentId });
    if (success) {
      // Fechar o modal e redirecionar para a página de sucesso
      closeModal();

      // Pequeno delay para garantir que o modal fechou antes do redirecionamento
      setTimeout(() => {
        router.push(`/payment/success?amount=${amount}&paymentIntentId=${paymentIntentId}`);
      }, 100);
    } else {
      showToast("Erro ao confirmar pagamento", "danger");
      setStep("amount");
    }
  };

  const handleBackToAmount = () => {
    setStep("amount");
    setPaymentIntent(null);
  };

  const handleCloseModal = () => {
    closeModal();
    // Resetar estado após fechar
    setTimeout(() => {
      setStep("amount");
      setAmount("");
      setPaymentIntent(null);
      setCpf("");
    }, 300);
  };

  const suggestedAmounts = [10, 50, 100, 200, 500];
  const showEmailField = !user;
  const showZipCodeField = !user || (user && !user.zipCode);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.substring(0, 5) + "-" + value.substring(5, 8);
    }
    setZipCode(value);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    // Formatação do CPF
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    setCpf(value);
  };

  if (!isClient) return null;

  return (
    <Dialog
      modalId="donation"
      title={step === "amount" ? t("title") : t("paymentTitle")}
      subtitle={step === "amount" ? t("subtitle") : t("paymentSubtitle")}
      onClose={handleCloseModal}
      icon={<Coffee className="text-yellow-500" />}
      size="md"
      actionButtons={
        step === "amount"
          ? {
              cancel: {
                label: t("cancelButton"),
                onClick: handleCloseModal,
              },
              confirm: {
                label: isLoading ? t("processingButton") : t("continueButton"),
                onClick: handleAmountSubmit,
                disabled: !amount || parseFloat(amount) <= 0 || isLoading,
                loading: isLoading,
              },
            }
          : undefined
      }
      open={isOpen}
    >
      <div className="space-y-4">
        {step === "amount" ? (
          <>
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
                  <div className="space-y-2 ">
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
                      onChange={handleZipCodeChange}
                      disabled={isLoading}
                      maxLength={9}
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("zipCodeHelp")}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="donation-cpf"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("cpf")}
                  </label>
                  <Input
                    id="donation-cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    disabled={isLoading}
                    maxLength={14}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("cpfHelp")}</p>
                </div>
              </div>
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
        ) : (
          <>
            <Button
              variant="transparent"
              size="sm"
              onClick={handleBackToAmount}
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
                  onSuccess={() => handlePaymentSuccess(paymentIntent.id)}
                  onCancel={handleBackToAmount}
                  isProcessing={isProcessingPayment}
                  billing={{
                    email: (user?.email ?? email) || "",
                    name: user?.name || "Doador",
                    phone: user?.phone || "",
                    country: "BR",
                    postalCode: zipCode.replace(/\D/g, ""),
                  }}
                />
              </Elements>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}
