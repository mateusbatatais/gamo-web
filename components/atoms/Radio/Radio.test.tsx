import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Radio } from "./Radio";

describe("Radio component", () => {
  it("renderiza com label", () => {
    render(<Radio label="Test label" />);
    expect(screen.getByText("Test label")).toBeInTheDocument();
  });

  it("renderiza com descrição", () => {
    render(<Radio description="Test description" />);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("muda estado quando clicado", async () => {
    const onChange = vi.fn();
    render(<Radio onChange={onChange} />);
    const radio = screen.getByRole("radio");
    await userEvent.click(radio);
    expect(onChange).toHaveBeenCalled();
  });

  it("fica desabilitado quando prop disabled é true", () => {
    render(<Radio disabled />);
    const radio = screen.getByRole("radio");
    expect(radio).toBeDisabled();
  });

  it("aplica classes customizadas", () => {
    render(<Radio className="custom-class" />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("custom-class");
  });

  it("exibe ponto interno quando marcado", () => {
    render(<Radio checked />);
    const dot = screen.getByRole("radio").nextElementSibling?.nextElementSibling;
    expect(dot).toBeInTheDocument();
  });

  it("não exibe ponto interno quando não marcado", () => {
    render(<Radio />);
    const dot = screen.getByRole("radio").nextElementSibling?.nextElementSibling;
    expect(dot).toBeFalsy();
  });

  it("exibe borda vermelha quando em estado de erro", () => {
    render(<Radio error />);
    const circle = screen.getByRole("radio").nextElementSibling;
    expect(circle).toHaveClass("border-danger");
  });

  it("exibe texto vermelho na label quando em estado de erro", () => {
    render(<Radio error label="Test label" />);
    const label = screen.getByText("Test label");
    expect(label).toHaveClass("text-danger");
  });

  it("exibe ponto vermelho quando marcado e com erro", () => {
    render(<Radio error checked />);
    const dot = screen.getByRole("radio").nextElementSibling?.nextElementSibling;
    expect(dot).toHaveClass("bg-danger");
  });

  it("exibe descrição em vermelho quando em estado de erro", () => {
    render(<Radio error description="Error description" />);
    const description = screen.getByText("Error description");
    expect(description).toHaveClass("text-danger");
  });

  it("mantém acessibilidade com aria-label", () => {
    render(<Radio aria-label="Accessible radio" />);
    expect(screen.getByLabelText("Accessible radio")).toBeInTheDocument();
  });

  it("responde ao clique na descrição", async () => {
    const onChange = vi.fn();
    render(<Radio description="Click me" onChange={onChange} label="Test" />);
    await userEvent.click(screen.getByText("Click me"));
    expect(onChange).toHaveBeenCalled();
  });
});

// Radio.test.tsx
describe("Comportamento de radio isolado", () => {
  it("deve marcar quando clicado em um radio isolado", async () => {
    render(<Radio label="Radio único" />);
    const radio = screen.getByRole("radio");

    await userEvent.click(radio);
    expect(radio).toBeChecked();
  });

  it("deve permanecer marcado ao clicar novamente", async () => {
    render(<Radio label="Radio único" />);
    const radio = screen.getByRole("radio");

    // Primeiro clique
    await userEvent.click(radio);
    expect(radio).toBeChecked();

    // Segundo clique
    await userEvent.click(radio);
    expect(radio).toBeChecked(); // Deve permanecer marcado
  });

  it("deve alternar corretamente quando controlado", async () => {
    const onChange = vi.fn();
    render(<Radio label="Controlado" checked={false} onChange={onChange} />);
    const radio = screen.getByRole("radio");

    await userEvent.click(radio);
    expect(onChange).toHaveBeenCalled();
  });
});
