// components/atoms/Card/Card.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";

describe("Card component", () => {
  it("renderiza o conteúdo dentro do card", () => {
    render(
      <Card>
        <p>Conteúdo do card</p>
      </Card>,
    );

    expect(screen.getByText("Conteúdo do card")).toBeInTheDocument();
  });

  it("aplica classes personalizadas", () => {
    const customClass = "minha-classe";
    render(
      <Card className={customClass}>
        <p>Card com classe personalizada</p>
      </Card>,
    );

    const card = screen.getByText("Card com classe personalizada").closest("div");
    expect(card).toHaveClass(customClass);
  });

  it("aplica estilos padrão do card", () => {
    render(
      <Card>
        <p>Card padrão</p>
      </Card>,
    );

    const card = screen.getByText("Card padrão").closest("div");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("rounded-xl");
    expect(card).toHaveClass("p-6");
    expect(card).toHaveClass("bg-white");
    expect(card).toHaveClass("shadow-sm");
  });

  it("aplica estilos de modo escuro", () => {
    // Simulando o modo escuro adicionando a classe dark no elemento pai
    document.documentElement.classList.add("dark");
    render(
      <Card>
        <p>Card modo escuro</p>
      </Card>,
    );

    const card = screen.getByText("Card modo escuro").closest("div");
    expect(card).toHaveClass("dark:bg-gray-800");
    expect(card).toHaveClass("dark:border-gray-700");

    // Limpando a classe após o teste
    document.documentElement.classList.remove("dark");
  });

  it("mantém as classes padrão quando personalizadas são fornecidas", () => {
    render(
      <Card className="custom-bg">
        <p>Card com classe personalizada</p>
      </Card>,
    );

    const card = screen.getByText("Card com classe personalizada").closest("div");
    expect(card).toHaveClass("custom-bg");
    expect(card).toHaveClass("rounded-xl"); // Classe padrão mantida
    expect(card).toHaveClass("p-6"); // Classe padrão mantida
  });

  it("renderiza corretamente com elementos complexos", () => {
    render(
      <Card>
        <div data-testid="complex-element">
          <h2>Título</h2>
          <p>Descrição</p>
          <button>Botão</button>
        </div>
      </Card>,
    );

    expect(screen.getByTestId("complex-element")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
