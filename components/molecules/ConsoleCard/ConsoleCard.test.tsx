import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConsoleCard from "./ConsoleCard";

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => {
    const normalizedSrc = src.startsWith("//") ? src.slice(1) : src;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={normalizedSrc} alt={alt} data-testid="next-image-mock" {...props} />
    );
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ConsoleCard Component", () => {
  const mockProps = {
    name: "PlayStation 5",
    consoleName: "PS5",
    brand: "Sony",
    imageUrl: "/images/consoles/sony/ps5.webp",
    description: "O mais recente console da Sony com tecnologia de ponta.",
    slug: "ps5-slim",
  };

  it("renderiza todas as informações corretamente", () => {
    render(<ConsoleCard {...mockProps} />);

    // Verifica textos
    expect(screen.getByText("PS5")).toBeInTheDocument();
    expect(screen.getByText("PlayStation 5")).toBeInTheDocument();
    expect(screen.getByText("Sony")).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();

    // Verifica a imagem
    const image = screen.getByTestId("next-image-mock");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockProps.imageUrl);
    expect(image).toHaveAttribute("alt", "PlayStation 5 console");

    // Verifica o link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/console/${mockProps.slug}`);
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

  it("renderiza corretamente quando description está vazia", () => {
    render(<ConsoleCard {...mockProps} description="" />);
    const descriptionElement = screen.queryByText(mockProps.description);
    expect(descriptionElement).not.toBeInTheDocument();
  });

  it("formata a URL da imagem corretamente", () => {
    render(<ConsoleCard {...mockProps} />);
    const image = screen.getByTestId("next-image-mock");
    expect(image).toHaveAttribute("src", "/images/consoles/sony/ps5.webp");
  });

  it("renderiza corretamente com valores mínimos", () => {
    render(
      <ConsoleCard
        name="Xbox"
        consoleName="Xbox Series X"
        brand="Microsoft"
        imageUrl="/xbox.jpg"
        description=""
        slug="xbox-series-x"
      />,
    );

    expect(screen.getByText("Xbox Series X")).toBeInTheDocument();
    expect(screen.getByText("Xbox")).toBeInTheDocument();
    expect(screen.getByText("Microsoft")).toBeInTheDocument();
  });
});
