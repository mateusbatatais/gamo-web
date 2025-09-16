// contexts/StripeContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

interface StripeContextType {
  stripe: Stripe | null;
  loading: boolean;
}

const StripeContext = createContext<StripeContextType>({
  stripe: null,
  loading: true,
});

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        const stripeInstance = await stripePromise;
        setStripe(stripeInstance);
      } catch (error) {
        console.error("Failed to initialize Stripe:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  return <StripeContext.Provider value={{ stripe, loading }}>{children}</StripeContext.Provider>;
}

export const useStripe = () => useContext(StripeContext);
