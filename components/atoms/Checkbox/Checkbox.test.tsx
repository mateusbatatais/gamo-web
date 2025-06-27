import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox component", () => {
  // Testes anteriores mantidos

  it("exibe borda vermelha quando em estado de erro", () => {
    render(<Checkbox error />);
    const box = screen.getByRole("checkbox").nextElementSibling;
    expect(box).toHaveClass("border-danger");
  });

  it("exibe texto vermelho na label quando em estado de erro", () => {
    render(<Checkbox error label="Test label" />);
    const label = screen.getByText("Test label");
    expect(label).toHaveClass("text-danger");
  });

  it("exibe fundo vermelho quando marcado e com erro", async () => {
    render(<Checkbox error />);
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    const box = checkbox.nextElementSibling;
    expect(box).toHaveClass("bg-danger");
  });

  it("mantém borda vermelha quando marcado e com erro", async () => {
    render(<Checkbox error />);
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    const box = checkbox.nextElementSibling;
    expect(box).toHaveClass("border-danger");
  });

  it("exibe ícone branco quando marcado, mesmo com erro", async () => {
    render(<Checkbox error />);
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    const svg = checkbox.nextElementSibling?.nextElementSibling;
    expect(svg).toHaveClass("opacity-100");
    expect(svg).toHaveClass("text-white");
  });

  it("exibe descrição em vermelho quando em estado de erro", () => {
    render(<Checkbox error description="Error description" />);
    const description = screen.getByText("Error description");
    expect(description).toHaveClass("text-danger");
  });

  it("não aplica estilo de erro quando não especificado", () => {
    render(<Checkbox label="Normal label" />);
    const label = screen.getByText("Normal label");
    const box = screen.getByRole("checkbox").nextElementSibling;

    expect(label).not.toHaveClass("text-danger");
    expect(box).not.toHaveClass("border-danger");
  });
});
