import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./Badge";

describe("Badge component", () => {
  it("renderiza com children", () => {
    render(<Badge>Teste</Badge>);
    expect(screen.getByText("Teste")).toBeInTheDocument();
  });

  it("aplica variante sólida primária por padrão", () => {
    render(<Badge status="primary">Primário</Badge>);
    const badge = screen.getByText("Primário");
    expect(badge).toHaveClass("bg-primary");
    expect(badge).toHaveClass("text-white");
  });

  it("aplica variante outline danger", () => {
    render(
      <Badge variant="outline" status="danger">
        Perigo
      </Badge>,
    );
    const badge = screen.getByText("Perigo");
    expect(badge).toHaveClass("border");
    expect(badge).toHaveClass("border-danger");
    expect(badge).toHaveClass("text-danger");
  });

  it("aplica variante soft success", () => {
    render(
      <Badge variant="soft" status="success">
        Sucesso
      </Badge>,
    );
    const badge = screen.getByText("Sucesso");
    expect(badge).toHaveClass("bg-success-100");
    expect(badge).toHaveClass("text-success-800");
  });

  it("aplica tamanho pequeno", () => {
    render(<Badge size="sm">Pequeno</Badge>);
    const badge = screen.getByText("Pequeno");
    expect(badge).toHaveClass("text-xs");
    expect(badge).toHaveClass("px-2");
    expect(badge).toHaveClass("py-0.5");
  });

  it("aplica classes customizadas", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText("Custom")).toHaveClass("custom-class");
  });
});
