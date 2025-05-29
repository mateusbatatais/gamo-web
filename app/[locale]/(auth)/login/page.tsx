// app/login/page.tsx
import { GoogleLoginButton } from "@/components/GoogleLoginButton/GoogleLoginButton";
import React from "react";

export const metadata = {
  title: "Login | GAMO",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Faça login na GAMO</h1>
      <GoogleLoginButton />
    </main>
  );
}
