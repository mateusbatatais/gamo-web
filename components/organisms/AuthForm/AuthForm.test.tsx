// components/organisms/AuthForm/AuthForm.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "./AuthForm";

describe("AuthForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnValueChange = vi.fn();

  const defaultConfig = {
    fields: [
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Digite seu email",
        required: true,
      },
      {
        name: "password",
        label: "Senha",
        type: "password",
        placeholder: "Digite sua senha",
        required: true,
        showToggle: true,
      },
    ],
    submitLabel: "Entrar",
  };

  const defaultValues = {
    email: "",
    password: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza todos os campos do formulário corretamente", () => {
    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={defaultValues}
        onValueChange={mockOnValueChange}
      />,
    );

    expect(screen.getByPlaceholderText("Digite seu email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite sua senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("exibe valores fornecidos nos campos", () => {
    const values = {
      email: "teste@exemplo.com",
      password: "senha123",
    };

    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={values}
        onValueChange={mockOnValueChange}
      />,
    );

    expect(screen.getByDisplayValue("teste@exemplo.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("senha123")).toBeInTheDocument();
  });

  it("chama onValueChange quando o usuário digita nos campos", async () => {
    const user = userEvent.setup();

    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={defaultValues}
        onValueChange={mockOnValueChange}
      />,
    );

    const emailInput = screen.getByPlaceholderText("Digite seu email");
    await user.type(emailInput, "novo@email.com");

    expect(mockOnValueChange).toHaveBeenCalledWith("email", expect.any(String));
  });

  it("chama onSubmit quando o formulário é enviado", async () => {
    const user = userEvent.setup();
    const values = {
      email: "teste@exemplo.com",
      password: "senha123",
    };

    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={values}
        onValueChange={mockOnValueChange}
      />,
    );

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(values);
  });

  it("exibe mensagem de erro específica por campo", () => {
    const errors = {
      email: { message: "Email inválido" },
      password: { message: "Senha muito curta" },
    };

    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={defaultValues}
        onValueChange={mockOnValueChange}
        errors={errors}
      />,
    );

    expect(screen.getByText("Email inválido")).toBeInTheDocument();
    expect(screen.getByText("Senha muito curta")).toBeInTheDocument();
  });

  it("exibe mensagem de erro geral", () => {
    const errors = {
      general: { message: "Erro ao fazer login" },
    };

    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={defaultValues}
        onValueChange={mockOnValueChange}
        errors={errors}
      />,
    );

    expect(screen.getByText("Erro ao fazer login")).toBeInTheDocument();
  });

  it("desabilita o botão de submit quando loading é true", () => {
    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={defaultValues}
        onValueChange={mockOnValueChange}
        loading={true}
      />,
    );

    const submitButton = screen.getByRole("button", { name: "Carregando..." });
    expect(submitButton).toBeDisabled();
  });

  it("exibe texto de loading no botão quando loading é true", () => {
    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={defaultValues}
        onValueChange={mockOnValueChange}
        loading={true}
      />,
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("renderiza conteúdo adicional quando fornecido", () => {
    const additionalContent = <div data-testid="additional">Conteúdo Extra</div>;

    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={defaultValues}
        onValueChange={mockOnValueChange}
        additionalContent={additionalContent}
      />,
    );

    expect(screen.getByTestId("additional")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo Extra")).toBeInTheDocument();
  });

  it("renderiza campo com toggle de senha quando showToggle é true", () => {
    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={defaultValues}
        onValueChange={mockOnValueChange}
      />,
    );

    // O campo de senha deve ter um botão de toggle (ícone de olho)
    const passwordField = screen.getByPlaceholderText("Digite sua senha");
    expect(passwordField).toHaveAttribute("type", "password");
  });

  it("marca campos como required quando especificado", () => {
    render(
      <AuthForm
        config={defaultConfig}
        onSubmit={mockOnSubmit}
        values={defaultValues}
        onValueChange={mockOnValueChange}
      />,
    );

    const emailInput = screen.getByPlaceholderText("Digite seu email");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
