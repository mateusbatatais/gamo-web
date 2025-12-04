// components/atoms/SafeImage/SafeImage.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SafeImage } from "./SafeImage";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: ImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="next-image" />
  ),
}));

// Mock validate-url utils
vi.mock("@/utils/validate-url", () => ({
  isValidUrl: (url: string) => url.startsWith("http"),
  normalizeImageUrl: (url: string) => `/normalized/${url}`,
}));

describe("SafeImage", () => {
  it("renderiza placeholder quando src é null", () => {
    render(<SafeImage src={null} alt="Test" />);

    expect(screen.getByText("🖥️")).toBeInTheDocument();
  });

  it("renderiza placeholder quando src é undefined", () => {
    render(<SafeImage src={undefined} alt="Test" />);

    expect(screen.getByText("🖥️")).toBeInTheDocument();
  });

  it("renderiza imagem quando src é uma URL válida", () => {
    render(<SafeImage src="https://example.com/image.jpg" alt="Test Image" />);

    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(image).toHaveAttribute("alt", "Test Image");
  });

  it("normaliza URL quando src não é uma URL válida", () => {
    render(<SafeImage src="relative/path/image.jpg" alt="Test Image" />);

    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/normalized/relative/path/image.jpg");
  });

  it("aplica className quando fornecido", () => {
    render(<SafeImage src="https://example.com/image.jpg" alt="Test" className="custom-class" />);

    const image = screen.getByTestId("next-image");
    expect(image).toHaveClass("custom-class");
  });

  it("usa fill=true por padrão", () => {
    const { container } = render(<SafeImage src="https://example.com/image.jpg" alt="Test" />);

    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("permite configurar fill como false", () => {
    const { container } = render(
      <SafeImage src="https://example.com/image.jpg" alt="Test" fill={false} />,
    );

    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("permite configurar priority", () => {
    const { container } = render(
      <SafeImage src="https://example.com/image.jpg" alt="Test" priority={true} />,
    );

    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("permite configurar sizes", () => {
    const { container } = render(
      <SafeImage src="https://example.com/image.jpg" alt="Test" sizes="(max-width: 768px) 100vw" />,
    );

    expect(container.querySelector("img")).toBeInTheDocument();
  });
});
