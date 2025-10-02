import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Avatar } from "./Avatar";

// Mock do Next.js Image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    className,
    sizes,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-testid="next-image"
      data-fill={fill}
      className={className}
      data-sizes={sizes}
    />
  ),
}));

// Mock da função isValidUrl
vi.mock("@/utils/validate-url", () => ({
  isValidUrl: (url: string) => {
    return url.startsWith("https://") || url.startsWith("http://");
  },
}));

describe("Avatar", () => {
  it("should render with initials when no image is provided", () => {
    render(<Avatar alt="João Silva" />);

    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("should render with single initial for single name", () => {
    render(<Avatar alt="Maria" />);

    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("should render with first and last name initials", () => {
    render(<Avatar alt="Carlos Eduardo Pereira" />);

    expect(screen.getByText("CP")).toBeInTheDocument();
  });

  it('should render fallback "U" when alt is empty', () => {
    render(<Avatar alt="" />);

    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("should render image when valid src is provided", () => {
    const validSrc = "https://example.com/avatar.jpg";
    render(<Avatar src={validSrc} alt="User Avatar" />);

    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", validSrc);
    expect(image).toHaveAttribute("alt", "User Avatar");
  });

  it('should use "Avatar" as alt when image is provided and alt is not specified', () => {
    const validSrc = "https://example.com/avatar.jpg";
    render(<Avatar src={validSrc} />);

    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("alt", "Avatar");
  });

  it("should not render image when invalid src is provided", () => {
    const invalidSrc = "invalid-url";
    render(<Avatar src={invalidSrc} alt="User Avatar" />);

    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
    expect(screen.getByText("UA")).toBeInTheDocument(); // Iniciais do alt
  });

  it("should not render image when src is null", () => {
    render(<Avatar src={null} alt="User Avatar" />);

    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
    expect(screen.getByText("UA")).toBeInTheDocument();
  });

  it("should apply correct size classes", () => {
    const { rerender } = render(<Avatar alt="Test" size="xs" />);

    const avatar = screen.getByText("T").parentElement;
    expect(avatar).toHaveClass("w-8", "h-8");

    rerender(<Avatar alt="Test" size="sm" />);
    expect(avatar).toHaveClass("w-12", "h-12");

    rerender(<Avatar alt="Test" size="md" />);
    expect(avatar).toHaveClass("w-16", "h-16");

    rerender(<Avatar alt="Test" size="lg" />);
    expect(avatar).toHaveClass("w-24", "h-24");

    rerender(<Avatar alt="Test" size="xl" />);
    expect(avatar).toHaveClass("w-32", "h-32");
  });

  it("should apply correct text size classes", () => {
    const { rerender } = render(<Avatar alt="Test" size="xs" />);

    const text = screen.getByText("T");
    expect(text).toHaveClass("text-xs");

    rerender(<Avatar alt="Test" size="sm" />);
    expect(text).toHaveClass("text-sm");

    rerender(<Avatar alt="Test" size="md" />);
    expect(text).toHaveClass("text-base");

    rerender(<Avatar alt="Test" size="lg" />);
    expect(text).toHaveClass("text-2xl");

    rerender(<Avatar alt="Test" size="xl" />);
    expect(text).toHaveClass("text-5xl");
  });

  it("should render custom fallback when provided", () => {
    const customFallback = <span data-testid="custom-fallback">Custom</span>;
    render(<Avatar alt="Test User" fallback={customFallback} />);

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.queryByText("TU")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(<Avatar alt="Test" className="custom-class" />);

    const avatar = screen.getByText("T").parentElement;
    expect(avatar).toHaveClass("custom-class");
  });

  it("should handle names with extra spaces", () => {
    render(<Avatar alt="  João   Silva  " />);

    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("should handle names with special characters", () => {
    render(<Avatar alt="Maria São João" />);

    expect(screen.getByText("MJ")).toBeInTheDocument();
  });

  it("should handle very long names", () => {
    render(<Avatar alt="João Carlos Eduardo Silva Santos Pereira Mendonça" />);

    expect(screen.getByText("JM")).toBeInTheDocument();
  });

  it("should handle names with apostrophes", () => {
    render(<Avatar alt="Carlos D'avilla" />);

    expect(screen.getByText("CD")).toBeInTheDocument();
  });

  it("should handle names with umlauts", () => {
    render(<Avatar alt="Ana Müller" />);

    expect(screen.getByText("AM")).toBeInTheDocument();
  });

  it("should pass correct props to Next.js Image when valid src", () => {
    const validSrc = "https://example.com/avatar.jpg";
    render(<Avatar src={validSrc} alt="User Avatar" size="md" />);

    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("src", validSrc);
    expect(image).toHaveAttribute("alt", "User Avatar");
    expect(image).toHaveAttribute("data-fill", "true");
    expect(image).toHaveClass("object-cover");
    expect(image).toHaveAttribute("data-sizes", "w-16 h-16");
  });
});
