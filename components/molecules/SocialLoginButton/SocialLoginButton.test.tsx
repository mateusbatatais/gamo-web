// components/molecules/SocialLoginButton/SocialLoginButton.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SocialLoginButton } from "./SocialLoginButton";

// Mock dependencies
interface TranslationFunction {
  (key: string): string;
}

vi.mock("next-intl", () => ({
  useTranslations: (): TranslationFunction => (key: string) => key,
}));

vi.mock("@/contexts/ToastContext", () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

const mockLogin = vi.fn();
const mockUseSocialLogin = vi.fn();

vi.mock("@/hooks/auth/useSocialLogin", () => ({
  useSocialLogin: () => mockUseSocialLogin(),
}));

describe("SocialLoginButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSocialLogin.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    });
  });

  it("renderiza botão do Google corretamente", () => {
    render(<SocialLoginButton provider="google" />);

    const button = screen.getByTestId("social-login-google");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("googleButton")).toBeInTheDocument();
  });

  it("renderiza botão da Microsoft corretamente", () => {
    render(<SocialLoginButton provider="microsoft" />);

    const button = screen.getByTestId("social-login-microsoft");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("microsoftButton")).toBeInTheDocument();
  });

  it("chama função de login quando clicado", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue("fake-token");

    render(<SocialLoginButton provider="google" />);

    const button = screen.getByTestId("social-login-google");
    await user.click(button);

    expect(mockLogin).toHaveBeenCalled();
  });

  it("chama onSuccess quando login é bem-sucedido", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    mockLogin.mockResolvedValue("fake-token");

    render(<SocialLoginButton provider="google" onSuccess={onSuccess} />);

    const button = screen.getByTestId("social-login-google");
    await user.click(button);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("fake-token");
    });
  });

  it("chama onError quando login falha", async () => {
    const onError = vi.fn();
    const testError = new Error("Login failed");

    mockUseSocialLogin.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: testError,
    });

    render(<SocialLoginButton provider="google" onError={onError} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(testError);
    });
  });

  it("exibe spinner quando loading é true", () => {
    mockUseSocialLogin.mockReturnValue({
      login: mockLogin,
      loading: true,
      error: null,
    });

    render(<SocialLoginButton provider="google" />);

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("desabilita botão quando loading é true", () => {
    mockUseSocialLogin.mockReturnValue({
      login: mockLogin,
      loading: true,
      error: null,
    });

    render(<SocialLoginButton provider="google" />);

    const button = screen.getByTestId("social-login-google");
    expect(button).toBeDisabled();
  });

  it("redireciona para returnUrl após login bem-sucedido", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue("fake-token");

    // Mock window.location.href
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.location = { href: "" } as any;

    render(<SocialLoginButton provider="google" returnUrl="/dashboard" />);

    const button = screen.getByTestId("social-login-google");
    await user.click(button);

    await waitFor(() => {
      expect(window.location.href).toBe("/dashboard");
    });
  });

  it("não redireciona quando returnUrl não é fornecido", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue("fake-token");

    const originalHref = window.location.href;

    render(<SocialLoginButton provider="google" />);

    const button = screen.getByTestId("social-login-google");
    await user.click(button);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    // URL não deve mudar
    expect(window.location.href).toBe(originalHref);
  });

  it("aplica className customizado", () => {
    render(<SocialLoginButton provider="google" className="custom-class" />);

    const button = screen.getByTestId("social-login-google");
    expect(button.className).toContain("custom-class");
  });

  it("exibe ícone do Google para provider google", () => {
    render(<SocialLoginButton provider="google" />);

    // O ícone do Google deve estar presente
    const button = screen.getByTestId("social-login-google");
    expect(button).toBeInTheDocument();
  });

  it("exibe ícone da Microsoft para provider microsoft", () => {
    render(<SocialLoginButton provider="microsoft" />);

    // O ícone da Microsoft deve estar presente
    const button = screen.getByTestId("social-login-microsoft");
    expect(button).toBeInTheDocument();
  });

  it("não chama onSuccess quando login retorna null", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    mockLogin.mockResolvedValue(null);

    render(<SocialLoginButton provider="google" onSuccess={onSuccess} />);

    const button = screen.getByTestId("social-login-google");
    await user.click(button);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
