import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState component", () => {
  it("renderiza título e descrição", () => {
    render(<EmptyState title="Título" description="Descrição" />);
    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
  });

  it("renderiza o ícone padrão quando nenhum ícone é fornecido", () => {
    render(<EmptyState title="Título" description="Descrição" />);
    expect(screen.getByTestId("default-icon-container")).toBeInTheDocument();
    expect(screen.getByTestId("default-svg")).toBeInTheDocument();
  });

  it("renderiza ícone personalizado quando fornecido", () => {
    render(
      <EmptyState
        title="Título"
        description="Descrição"
        icon={<div data-testid="custom-icon" />}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("não renderiza botão de ação quando actionText ou onAction não são fornecidos", () => {
    render(<EmptyState title="Título" description="Descrição" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renderiza botão de ação quando actionText e onAction são fornecidos", () => {
    const onAction = vi.fn();
    render(
      <EmptyState title="Título" description="Descrição" actionText="Ação" onAction={onAction} />,
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Ação");
  });

  it("aplica classes de modo dark para texto e fundo", () => {
    // Renderize dentro de um wrapper com classe dark
    render(
      <div className="dark">
        <EmptyState title="Título" description="Descrição" variant="simple" />
      </div>,
    );

    const container = screen.getByTestId("empty-state-container");
    expect(container).toHaveClass("dark:bg-gray-800/50");

    const title = screen.getByText("Título");
    expect(title).toHaveClass("dark:text-white");

    const description = screen.getByText("Descrição");
    expect(description).toHaveClass("dark:text-gray-400");
  });

  it("aplica variantes de layout corretamente", () => {
    render(<EmptyState title="Título" description="Descrição" variant="card" />);

    const container = screen.getByTestId("empty-state-container");
    expect(container).toHaveClass("bg-white");
    expect(container).toHaveClass("border");
    expect(container).toHaveClass("rounded-xl");
    expect(container).toHaveClass("shadow-sm");
  });

  it("aplica tamanhos corretamente", () => {
    render(<EmptyState title="Título" description="Descrição" size="lg" />);

    const title = screen.getByText("Título");
    expect(title).toHaveClass("text-2xl");

    const description = screen.getByText("Descrição");
    expect(description).toHaveClass("text-base");
  });

  it("aplica classes de tamanho SM corretamente", () => {
    render(<EmptyState title="Título" description="Descrição" size="sm" />);

    const title = screen.getByText("Título");
    expect(title).toHaveClass("text-lg");

    const description = screen.getByText("Descrição");
    expect(description).toHaveClass("text-sm");
  });
});
