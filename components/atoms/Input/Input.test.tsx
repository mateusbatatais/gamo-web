// components/Input/Input.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Input component", () => {
  it("exibe o label quando fornecido", () => {
    render(<Input label="Email" placeholder="Digite aqui" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("exibe a mensagem de erro corretamente", () => {
    render(<Input label="Nome" placeholder="Digite aqui" error="Campo obrigatório" />);
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
  });

  it("aplica estilos de desabilitado quando `disabled` é true", () => {
    render(<Input label="Email" disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("renderiza com ícone se a prop `icon` for fornecida", () => {
    render(<Input label="Com Ícone" icon={<span data-testid="icon">i</span>} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("aplica classes de tamanho corretamente (inputSize)", () => {
    render(<Input label="Grande" inputSize="lg" />);
    const input = screen.getByRole("textbox");
    // Espera-se que contenha a classe `text-lg` quando inputSize="lg"
    expect(input).toHaveClass("text-lg");
  });

  it("mostra e oculta senha quando `showToggle=true` e `type='password'`", async () => {
    const user = userEvent.setup();

    // Renderiza o Input como senha com toggle habilitado e placeholder específico:
    render(<Input label="Senha" type="password" placeholder="••••••••" showToggle={true} />);

    // 1) Para encontrar o campo de senha, usamos o placeholder
    const pwdInput = screen.getByPlaceholderText("••••••••");
    expect(pwdInput).toHaveAttribute("type", "password");

    // 2) O toggle de senha é um botão (ícone de olho)
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();

    // 3) Ao clicar pela primeira vez, o type muda para "text"
    await user.click(toggleButton);
    expect(pwdInput).toHaveAttribute("type", "text");

    // 4) Ao clicar de novo, deve voltar para "password"
    await user.click(toggleButton);
    expect(pwdInput).toHaveAttribute("type", "password");
  });
});
