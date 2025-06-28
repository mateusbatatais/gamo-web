import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InfoItem from "./InfoItem";

describe("InfoItem component", () => {
  it("renderiza label e valor", () => {
    render(<InfoItem label="Nome" value="João Silva" />);

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Nome")).toHaveClass("text-gray-500");
    expect(screen.getByText("João Silva")).toHaveClass("text-gray-900");
  });

  it("renderiza '-' quando value é vazio", () => {
    render(<InfoItem label="Email" value={null} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renderiza valor como ReactNode", () => {
    render(<InfoItem label="Status" value={<span className="text-green-500">Ativo</span>} />);

    const valueElement = screen.getByText("Ativo");
    expect(valueElement).toBeInTheDocument();
    expect(valueElement).toHaveClass("text-green-500");
    expect(valueElement.tagName).toBe("SPAN");
  });

  it("aplica classes corretas para label e value", () => {
    render(<InfoItem label="Idade" value="30" />);

    const label = screen.getByText("Idade");
    const value = screen.getByText("30");

    expect(label).toHaveClass("text-sm", "font-medium", "text-gray-500");
    expect(value).toHaveClass("mt-1", "text-sm", "text-gray-900");
  });

  it("mantém estrutura semântica com dt e dd", () => {
    const { container } = render(<InfoItem label="Cargo" value="Desenvolvedor" />);

    const dt = container.querySelector("dt");
    const dd = container.querySelector("dd");

    expect(dt).toBeInTheDocument();
    expect(dd).toBeInTheDocument();
    expect(dt).toHaveTextContent("Cargo");
    expect(dd).toHaveTextContent("Desenvolvedor");
  });
});
