"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { GoogleLoginButton } from "@/components/GoogleLoginButton/GoogleLoginButton";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      localStorage.setItem("gamo_token", data.token);
      router.push(`/dashboard`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao entrar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">Entrar na GAMO</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="seu@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle={true}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button
          type="submit"
          label={loading ? "Entrando..." : "Entrar"}
          variant="primary"
          disabled={loading}
          className="w-full"
        />
      </form>

      <div className="my-4 flex items-center">
        <hr className="flex-1 border-gray-300" />
        <span className="px-2 text-gray-500 text-sm">ou</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <GoogleLoginButton />

      <div className="mt-6 flex justify-between text-sm">
        <Link href="/recover" className="text-primary hover:underline">
          Esqueceu a senha?
        </Link>
        <Link href="/signup" className="text-primary hover:underline">
          Criar conta
        </Link>
      </div>
    </>
  );
}
