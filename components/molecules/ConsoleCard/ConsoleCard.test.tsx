import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
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
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="next-image-mock" onError={onError} {...props} />;
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
  const baseProps = {
    name: "PlayStation 5",
    consoleName: "PS5 Console",
    brand: "Sony",
    description: "Next-gen gaming console",
    slug: "ps5-slim",
  };

  afterEach(() => {
    cleanup();
  });

  it("renderiza todas as informações corretamente", () => {
    render(<ConsoleCard {...baseProps} imageUrl="images/consoles/sony/ps5.webp" />);

    // Verifica textos
    expect(screen.getByText("PS5 Console")).toBeInTheDocument();
    expect(screen.getByText("PlayStation 5")).toBeInTheDocument();
    expect(screen.getByText("Sony")).toBeInTheDocument();
    expect(screen.getByText("Next-gen gaming console")).toBeInTheDocument();

    // Verifica a imagem
    const image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/images/consoles/sony/ps5.webp");
    expect(image).toHaveAttribute("alt", "PlayStation 5 console");

    // Verifica o link
    const link = screen.getAllByRole("link")[0];
    expect(link).toHaveAttribute("href", "/console/ps5-slim");
  });

  it("mostra ícone de fallback quando a imagem falha", () => {
    render(<ConsoleCard {...baseProps} imageUrl="fail-image.webp" />);

    // Forçar erro na imagem
    const image = screen.getByTestId("next-image-mock");
    fireEvent.error(image);

    // Verificar se o ícone de fallback aparece
    expect(screen.getByTestId("monitor-icon")).toBeInTheDocument();
  });

  it("mostra ícone de gamepad para consoles não tradicionais", () => {
    render(
      <ConsoleCard
        {...baseProps}
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

  it("normaliza URL sem barra inicial", () => {
    render(<ConsoleCard {...baseProps} imageUrl="test-image.webp" />);
    const image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/test-image.webp");
  });

  it("normaliza URL com barra inicial", () => {
    render(<ConsoleCard {...baseProps} imageUrl="/test-image.webp" />);
    const image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/test-image.webp");
  });

  it("normaliza URL com duas barras", () => {
    render(<ConsoleCard {...baseProps} imageUrl="//test-image.webp" />);
    const image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/test-image.webp");
  });

  it("normaliza URL vazia para padrão", () => {
    render(<ConsoleCard {...baseProps} imageUrl="" />);
    const image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/default-console.webp");
  });

  it("aplica as classes CSS corretamente", () => {
    const { container } = render(<ConsoleCard {...baseProps} imageUrl="test-image.webp" />);
    const card = container.firstChild;

    // Verifica classes principais
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("shadow-sm");
    expect(card).toHaveClass("hover:shadow-md");
  });
});
