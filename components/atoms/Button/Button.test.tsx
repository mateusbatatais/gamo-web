import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";
import { Check } from "lucide-react";

describe("Button component", () => {
  it("renderiza com o label correto", () => {
    render(<Button label="Testar" />);
    expect(screen.getByRole("button")).toHaveTextContent("Testar");
  });

  it("renderiza com children quando fornecido", () => {
    render(
      <Button>
        <span data-testid="child">Children</span>
      </Button>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("chama onClick quando clicado", async () => {
    const onClick = vi.fn();
    render(<Button label="Clicável" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("fica desabilitado quando a prop disabled é true", () => {
    render(<Button label="Desabilitado" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("aplica classe de variante primária", () => {
    render(<Button label="Primário" variant="primary" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-primary");
  });

  it("aplica classe de status danger para variante sólida", () => {
    render(<Button label="Erro" status="danger" variant="primary" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-danger-500");
  });

  it("aplica classes de status danger para variante outline", () => {
    render(<Button label="Erro" status="danger" variant="outline" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("text-danger-500");
    expect(button.className).toContain("border-danger-500");
  });

  it("aplica classe de tamanho pequeno", () => {
    render(<Button label="Pequeno" size="sm" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("text-sm");
  });

  it("renderiza ícone se fornecido", () => {
    render(<Button label="Com ícone" icon={<Check data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("deve ter cursor-pointer por padrão", () => {
    render(<Button label="Cursor" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("cursor-pointer");
  });

  it("deve ter cursor-not-allowed quando desabilitado", () => {
    render(<Button label="Desabilitado" disabled />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("cursor-not-allowed");
  });
});
