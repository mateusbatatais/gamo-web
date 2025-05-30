// components/Input/Input.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Input component", () => {
  it("exibe o label quando fornecido", () => {
    render(<Input label="Email" placeholder="Digite aqui" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("exibe a mensagem de erro corretamente", () => {
    render(<Input error="Campo obrigatório" placeholder="Digite aqui" />);
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
  });

  it("aplica estilos desabilitado quando `disabled` é true", () => {
    render(<Input label="Email" disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("renderiza com ícone se fornecido", () => {
    render(
      <Input label="Com Ícone" icon={<span data-testid="icon">i</span>} />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("aplica classes de tamanho corretamente", () => {
    render(<Input label="Grande" inputSize="lg" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toMatch(/text-lg/);
  });
});
