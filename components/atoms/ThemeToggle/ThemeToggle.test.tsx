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
    });
    render(<ThemeToggle />);
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });

  it("renderiza o ícone de monitor no tema sistema", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle />);
    expect(screen.getByTestId("monitor-icon")).toBeInTheDocument();
  });

  it("alterna de light para dark ao clicar", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("alterna de dark para system ao clicar", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });

  it("alterna de system para light ao clicar", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("mostra texto 'Modo Escuro' no tema claro no modo 'text'", () => {
    render(<ThemeToggle variant="text" />);
    expect(screen.getByText("Modo Escuro")).toBeInTheDocument();
  });

  it("mostra texto 'Modo Claro' no tema escuro no modo 'text'", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle variant="text" />);
    expect(screen.getByText("Modo Claro")).toBeInTheDocument();
  });

  it("mostra texto 'Modo Sistema' no tema sistema no modo 'text'", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle variant="text" />);
    expect(screen.getByText("Modo Sistema")).toBeInTheDocument();
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
    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });

  it("destaca botão do sistema quando ativo", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle variant="full" showSystemOption />);
    const systemButton = screen.getAllByRole("button")[0];

    expect(systemButton).toHaveClass("bg-gray-200");
    expect(systemButton).toHaveClass("dark:bg-gray-700");
  });

  it("aplica classes de tamanho corretamente", () => {
    render(<ThemeToggle size="sm" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("p-1.5");
  });
});
