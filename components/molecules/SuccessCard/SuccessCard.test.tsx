import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SuccessCard } from "./SuccessCard";
import { Info } from "lucide-react";

// Mock do Link do Next.js
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SuccessCard component", () => {
  const baseProps = {
    title: "Success!",
    message: "Your action was completed successfully",
    buttonHref: "/dashboard",
    buttonLabel: "Go to Dashboard",
  };

  it("renderiza título e mensagem", () => {
    render(<SuccessCard {...baseProps} />);
    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("Your action was completed successfully")).toBeInTheDocument();
  });

  it("renderiza o botão com o label correto", () => {
    render(<SuccessCard {...baseProps} />);
    expect(screen.getByRole("button", { name: "Go to Dashboard" })).toBeInTheDocument();
  });

  it("usa o componente Link com href correto", () => {
    render(<SuccessCard {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("renderiza ícone padrão para status success", () => {
    render(<SuccessCard {...baseProps} />);
    expect(screen.getByTestId("success-card").querySelector("svg")).toBeInTheDocument();
  });

  it("permite customizar o ícone", () => {
    render(<SuccessCard {...baseProps} icon={<Info data-testid="custom-icon" />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renderiza conteúdo adicional", () => {
    render(
      <SuccessCard
        {...baseProps}
        additionalContent={<div data-testid="additional">Extra info</div>}
      />,
    );
    expect(screen.getByTestId("additional")).toBeInTheDocument();
  });

  it("aplica classes de status corretas", () => {
    const { rerender } = render(<SuccessCard {...baseProps} status="success" />);
    const iconContainer = screen.getByTestId("success-card").firstChild;
    expect(iconContainer).toHaveClass("text-success");

    rerender(<SuccessCard {...baseProps} status="warning" />);
    expect(iconContainer).toHaveClass("text-warning");
  });

  it("aplica modo dark corretamente", () => {
    document.documentElement.classList.add("dark");
    render(<SuccessCard {...baseProps} status="success" />);
    const iconContainer = screen.getByTestId("success-card").firstChild;
    expect(iconContainer).toHaveClass("dark:text-success-400");
    document.documentElement.classList.remove("dark");
  });

  it("permite customizar o botão", () => {
    render(<SuccessCard {...baseProps} buttonVariant="outline" buttonStatus="danger" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("border-danger-500");
  });

  it("aplica classes customizadas", () => {
    render(<SuccessCard {...baseProps} className="custom-class" />);
    expect(screen.getByTestId("success-card")).toHaveClass("custom-class");
  });
});
