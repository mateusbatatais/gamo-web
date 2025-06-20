// components/molecules/ConsoleCard/ConsoleCard.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ConsoleCard from "./ConsoleCard";
import type { ImageProps } from "next/image";

// Mock do componente Image do Next.js com tipagem adequada
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    // Solução para o erro do ESLint: usamos o componente Image mockado
    const { src, alt, width, height, className } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src as string} alt={alt} width={width} height={height} className={className} />
    );
  },
}));

describe("ConsoleCard Component", () => {
  const mockProps = {
    name: "PlayStation 5",
    consoleName: "PS5",
    brand: "Sony",
    slug: "ps5-slim",
    imageUrl: "ps5.jpg",
    description: "O mais recente console da Sony com tecnologia de ponta.",
  };

  it("renderiza todas as informações corretamente", () => {
    render(<ConsoleCard {...mockProps} />);

    // Verifica a imagem
    const image = screen.getByRole("img", { name: mockProps.name });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", `/${mockProps.imageUrl}`);

    // Verifica os textos
    expect(screen.getByText(mockProps.consoleName)).toBeInTheDocument();
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.brand)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it("aplica as classes CSS corretamente", () => {
    const { container } = render(<ConsoleCard {...mockProps} />);
    const card = container.firstChild;

    expect(card).toHaveClass("border", "p-4", "rounded", "shadow-lg");

    const image = screen.getByRole("img");
    expect(image).toHaveClass("w-full", "h-48", "object-cover", "mb-4", "rounded");

    expect(screen.getByText(mockProps.consoleName)).toHaveClass("font-semibold");
    expect(screen.getByText(mockProps.name)).toHaveClass("text-xs");
    expect(screen.getByText(mockProps.brand)).toHaveClass("text-gray-500");
    expect(screen.getByText(mockProps.description)).toHaveClass("text-sm", "text-gray-700", "mt-2");
  });

  it("renderiza corretamente quando description está vazia", () => {
    const propsWithoutDescription = { ...mockProps, description: "" };
    render(<ConsoleCard {...propsWithoutDescription} />);

    const descriptionElement = screen.queryByText(mockProps.description);
    expect(descriptionElement).not.toBeInTheDocument();
  });

  it("formata a URL da imagem corretamente", () => {
    render(<ConsoleCard {...mockProps} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", `/${mockProps.imageUrl}`);
  });

  it("renderiza corretamente com valores mínimos", () => {
    const minimalProps = {
      name: "Xbox",
      consoleName: "Xbox Series X",
      brand: "Microsoft",
      imageUrl: "xbox.jpg",
      description: "",
      slug: "xbox-series-x",
    };

    render(<ConsoleCard {...minimalProps} />);

    expect(screen.getByText(minimalProps.consoleName)).toBeInTheDocument();
    expect(screen.getByText(minimalProps.name)).toBeInTheDocument();
    expect(screen.getByText(minimalProps.brand)).toBeInTheDocument();
    expect(screen.queryByTestId("description")).toBeNull();
  });
});
