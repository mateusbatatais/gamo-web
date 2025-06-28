import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

// Mock do hook useTheme
vi.mock("@/hooks/useTheme", () => ({
  useTheme: vi.fn(),
}));

// Mock do matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query === "(prefers-color-scheme: dark)",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

vi.mock("lucide-react", () => ({
  Moon: () => <span data-testid="moon-icon">🌙</span>,
  Sun: () => <span data-testid="sun-icon">☀️</span>,
  Monitor: () => <span data-testid="monitor-icon">💻</span>,
}));

describe("ThemeToggle component", () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      toggleTheme: vi.fn(),
    });
  });

  it("renderiza o ícone de lua no tema claro", () => {
    render(<ThemeToggle />);
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
  });

  it("renderiza o ícone de sol no tema escuro", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      toggleTheme: vi.fn(),
    });
    render(<ThemeToggle />);
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });

  it("alterna para tema escuro ao clicar no tema claro", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("alterna para tema claro ao clicar no tema escuro", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      toggleTheme: vi.fn(),
    });
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("mostra texto no modo 'text'", () => {
    render(<ThemeToggle variant="text" />);
    expect(screen.getByText("Modo Escuro")).toBeInTheDocument();
  });

  it("mostra opção de sistema no modo 'full'", () => {
    render(<ThemeToggle variant="full" showSystemOption />);
    expect(screen.getByTestId("monitor-icon")).toBeInTheDocument();
    expect(screen.getByTitle("Usar tema do sistema")).toBeInTheDocument();
  });

  it("define tema do sistema quando selecionado", () => {
    render(<ThemeToggle variant="full" showSystemOption />);
    const systemButton = screen.getAllByRole("button")[0];
    fireEvent.click(systemButton);
    expect(mockSetTheme).toHaveBeenCalled();
  });

  it("exibe skeleton durante o carregamento", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme,
      toggleTheme: vi.fn(),
    } as unknown as ReturnType<typeof useTheme>);

    render(<ThemeToggle />);
    expect(screen.getByTestId("theme-toggle-skeleton")).toBeInTheDocument();
  });

  it("aplica classes de tamanho corretamente", () => {
    render(<ThemeToggle size="sm" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("p-1.5");
  });
});
