// components/GoogleLoginButton/GoogleLoginButton.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GoogleLoginButton } from "./GoogleLoginButton";
import * as googleLoginHook from "../../hooks/useGoogleLogin";
import * as api from "../../utils/api";

describe("GoogleLoginButton", () => {
  beforeEach(() => {
    // Restaura todos os mocks para o estado original
    vi.restoreAllMocks();
    // Limpa o localStorage
    localStorage.clear();
    // Mock de window.location.href
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
    // Garante que a variável de ambiente exista
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
  });

  it("renderiza o botão inicialmente", () => {
    render(<GoogleLoginButton />);
    expect(screen.getByRole("button")).toHaveTextContent("Entrar com Google");
  });

  it("exibe estado de carregamento ao clicar", async () => {
    // Mocka apiFetch para resolver imediatamente
    vi.spyOn(api, "apiFetch").mockResolvedValue({ token: "jwt" });
    render(<GoogleLoginButton />);

    const btn = screen.getByRole("button");
    userEvent.click(btn);

    // Botão fica desabilitado e texto muda
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent("Entrando...");

    // Aguarda a chamada de apiFetch
    await waitFor(() => {
      expect(api.apiFetch).toHaveBeenCalled();
    });
  });

  it("armazena token e navega em caso de sucesso", async () => {
    // Mock do hook para retornar o ID token
    vi.spyOn(googleLoginHook, "useGoogleLogin").mockReturnValue({
      login: async () => "fake-id-token",
    });
    // Mock de apiFetch para retornar o JWT do backend
    vi.spyOn(api, "apiFetch").mockResolvedValue({ token: "jwt-token" });

    render(<GoogleLoginButton />);

    const btn = screen.getByRole("button");
    userEvent.click(btn);

    // Aguarda a chamada com os parâmetros corretos
    await waitFor(() => {
      expect(api.apiFetch).toHaveBeenCalledWith(
        "/auth/social/google",
        expect.objectContaining({ method: "POST", token: "fake-id-token" })
      );
    });

    // Verifica se o token foi salvo no localStorage
    expect(localStorage.getItem("gamo_token")).toBe("jwt-token");
    // E se a página mudou para /pt/dashboard
    expect(window.location.href).toBe("/pt/dashboard");
  });

  it("mostra mensagem de erro em caso de falha", async () => {
    // Mock de apiFetch para rejeitar a chamada
    vi.spyOn(api, "apiFetch").mockRejectedValue(new Error("fail"));

    render(<GoogleLoginButton />);

    const btn = screen.getByRole("button");
    userEvent.click(btn);

    // Aguarda e verifica a mensagem de erro
    const errorMsg = await screen.findByText(
      "Falha no login. Tente novamente."
    );
    expect(errorMsg).toBeInTheDocument();
    // Botão deve voltar a ficar habilitado
    expect(btn).not.toBeDisabled();
  });
});
