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

  it("aplica classe de status danger", () => {
    render(<Button label="Erro" status="danger" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-red-600");
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

  it("posiciona o ícone à esquerda por padrão com espaçamento mr-2", () => {
    render(<Button label="Esquerda" icon={<Check data-testid="icon-left" />} />);
    const button = screen.getByRole("button");
    const iconWrapper = screen.getByTestId("icon-left").parentElement;
    expect(iconWrapper).toHaveClass("mr-2");
    // Verifica ordem: ícone primeiro, depois o texto
    const children = Array.from(button.childNodes);
    expect(children[0]).toContainElement(screen.getByTestId("icon-left"));
    expect(children[1].textContent).toBe("Esquerda");
  });

  it('posiciona o ícone à direita quando iconPosition="right" com espaçamento ml-2', () => {
    render(
      <Button label="Direita" icon={<Check data-testid="icon-right" />} iconPosition="right" />,
    );
    const button = screen.getByRole("button");
    const iconWrapper = screen.getByTestId("icon-right").parentElement;
    expect(iconWrapper).toHaveClass("ml-2");
    // Verifica ordem: texto primeiro, depois ícone
    const children = Array.from(button.childNodes);
    expect(children[0].textContent).toBe("Direita");
    expect(children[1]).toContainElement(screen.getByTestId("icon-right"));
  });
});
