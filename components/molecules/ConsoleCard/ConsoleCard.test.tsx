import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConsoleCard from "./ConsoleCard";

// Mock do next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    onError,
    ...props
  }: {
    src: string;
    alt: string;
    onError: () => void;
    fill: boolean;
    className: string;
    sizes: string;
  }) => {
    // Simular erro se a src for uma string vazia
    if (src === "/fail-image.webp") {
      return <img {...props} alt={alt} data-testid="next-image-mock" onError={onError} />;
    }

    return <img src={src} alt={alt} data-testid="next-image-mock" {...props} />;
  },
}));

// Mock dos ícones
vi.mock("lucide-react", () => ({
  Monitor: () => <div data-testid="monitor-icon">Monitor</div>,
  Gamepad: () => <div data-testid="gamepad-icon">Gamepad</div>,
}));

// Mock do Link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ConsoleCard Component", () => {
  const mockProps = {
    name: "PlayStation 5",
    consoleName: "PS5 Console",
    brand: "Sony",
    imageUrl: "images/consoles/sony/ps5.webp",
    description: "Next-gen gaming console",
    slug: "ps5-slim",
  };

  it("renderiza todas as informações corretamente", () => {
    render(<ConsoleCard {...mockProps} />);

    // Verifica textos
    expect(screen.getByText("PS5 Console")).toBeInTheDocument();
    expect(screen.getByText("PlayStation 5")).toBeInTheDocument();
    expect(screen.getByText("Sony")).toBeInTheDocument();
    expect(screen.getByText("Next-gen gaming console")).toBeInTheDocument();

    // Verifica a imagem
    const image = screen.getByTestId("next-image-mock");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/consoles/sony/ps5.webp");
    expect(image).toHaveAttribute("alt", "PlayStation 5 console");

    // Verifica o link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/console/ps5-slim");
  });

  it("mostra ícone de fallback quando a imagem falha", () => {
    render(<ConsoleCard {...mockProps} imageUrl="fail-image.webp" />);

    // Forçar erro na imagem
    const image = screen.getByTestId("next-image-mock");
    fireEvent.error(image);

    // Verificar se o ícone de fallback aparece
    expect(screen.getByTestId("monitor-icon")).toBeInTheDocument();
  });

  it("mostra ícone de gamepad para consoles não tradicionais", () => {
    render(
      <ConsoleCard
        {...mockProps}
        imageUrl="fail-image.webp"
        consoleName="Handheld Gaming Device"
      />,
    );

    // Forçar erro na imagem
    const image = screen.getByTestId("next-image-mock");
    fireEvent.error(image);

    // Verificar se o ícone de gamepad aparece
    expect(screen.getByTestId("gamepad-icon")).toBeInTheDocument();
  });

  it("normaliza diferentes formatos de URL de imagem", () => {
    // Teste 1: URL sem barra inicial
    render(<ConsoleCard {...mockProps} imageUrl="test-image.webp" />);
    let image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/test-image.webp");

    // Teste 2: URL com barra inicial
    render(<ConsoleCard {...mockProps} imageUrl="/test-image.webp" />);
    image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/test-image.webp");

    // Teste 3: URL com duas barras
    render(<ConsoleCard {...mockProps} imageUrl="//test-image.webp" />);
    image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/test-image.webp");

    // Teste 4: URL vazia
    render(<ConsoleCard {...mockProps} imageUrl="" />);
    image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/default-console.webp");
  });

  it("aplica as classes CSS corretamente", () => {
    const { container } = render(<ConsoleCard {...mockProps} />);
    const card = container.firstChild;

    // Verifica classes principais
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("shadow-sm");
    expect(card).toHaveClass("hover:shadow-md");
  });
});
