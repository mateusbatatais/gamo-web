import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner component", () => {
  it("renderiza com ícone padrão", () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText("Carregando");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("renderiza com variante 'rotate'", () => {
    render(<Spinner variant="rotate" />);
    const spinner = screen.getByLabelText("Carregando");
    expect(spinner).toHaveClass("lucide-rotate-cw");
  });

  it("aplica cor primary", () => {
    render(<Spinner variant="primary" />);
    const spinner = screen.getByLabelText("Carregando");
    expect(spinner).toHaveClass("text-primary");
    expect(spinner).toHaveClass("dark:text-primary-400");
  });

  it("aplica tamanho customizado", () => {
    render(<Spinner size={32} />);
    const spinner = screen.getByLabelText("Carregando");
    expect(spinner).toHaveAttribute("width", "32");
    expect(spinner).toHaveAttribute("height", "32");
  });

  it("aplica classes customizadas", () => {
    render(<Spinner className="custom-class" />);
    expect(screen.getByLabelText("Carregando")).toHaveClass("custom-class");
  });

  // Novo teste para verificar o stroke width
  it("aplica espessura de linha customizada", () => {
    render(<Spinner strokeWidth={3} />);
    const spinner = screen.getByLabelText("Carregando");
    expect(spinner).toHaveAttribute("stroke-width", "3");
  });
});
