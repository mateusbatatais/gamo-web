// components/atoms/InputPhone/InputPhone.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { InputPhone } from "./InputPhone";

describe("InputPhone component", () => {
  it("exibe o label quando fornecido", () => {
    render(<InputPhone label="Telefone" />);
    expect(screen.getByText("Telefone")).toBeInTheDocument();
  });

  it("exibe a mensagem de erro corretamente", () => {
    render(<InputPhone label="Telefone" error="Número inválido" />);
    expect(screen.getByText("Número inválido")).toBeInTheDocument();
  });

  it("aplica estilos de desabilitado quando `disabled` é true", () => {
    render(<InputPhone label="Telefone" disabled />);
    const phoneInput = screen.getByRole("textbox");
    expect(phoneInput).toBeDisabled();
  });

  it("chama onChange quando o valor é alterado", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<InputPhone label="Telefone" onChange={handleChange} />);

    const phoneInput = screen.getByRole("textbox");
    await user.type(phoneInput, "11999999999");

    expect(handleChange).toHaveBeenCalled();
  });

  it("exibe valor inicial quando fornecido", () => {
    render(<InputPhone label="Telefone" value="+5511999999999" />);
    const phoneInput = screen.getByRole("textbox");
    expect(phoneInput).toHaveValue();
  });

  it("mostra indicador de obrigatório quando required é true", () => {
    render(<InputPhone label="Telefone" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("aplica classes de estilo corretamente", () => {
    render(<InputPhone label="Telefone" className="custom-class" />);
    const container = screen.getByText("Telefone").parentElement;
    expect(container).toBeInTheDocument();
  });

  it("aceita diferentes países como defaultCountry", () => {
    const { rerender } = render(<InputPhone label="Telefone" defaultCountry="US" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    rerender(<InputPhone label="Telefone" defaultCountry="PT" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("mostra erro de validação quando o número é inválido", async () => {
    const user = userEvent.setup();
    render(<InputPhone label="Telefone" validateOnChange={true} />);

    const phoneInput = screen.getByRole("textbox");
    await user.type(phoneInput, "123");
    await user.tab(); // Para trigger do blur

    expect(screen.getByText("Número de telefone inválido")).toBeInTheDocument();
  });

  it("chama onValidityChange quando a validação muda", async () => {
    const user = userEvent.setup();
    const handleValidityChange = vi.fn();

    render(
      <InputPhone
        label="Telefone"
        validateOnChange={true}
        onValidityChange={handleValidityChange}
      />,
    );

    const phoneInput = screen.getByRole("textbox");
    await user.type(phoneInput, "11999999999");

    expect(handleValidityChange).toHaveBeenCalled();
  });
});
