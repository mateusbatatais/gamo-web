import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea component", () => {
  it("exibe o label quando fornecido", () => {
    render(<Textarea label="Comentário" placeholder="..." />);
    expect(screen.getByText("Comentário")).toBeInTheDocument();
  });

  it("exibe a mensagem de erro corretamente", () => {
    render(<Textarea label="Feedback" placeholder="..." error="Campo requerido" />);
    expect(screen.getByText("Campo requerido")).toBeInTheDocument();
  });

  it("aplica estilos de desabilitado quando `disabled` é true", () => {
    render(<Textarea label="Notas" disabled />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });

  it("aplica classes de tamanho corretamente (inputSize)", () => {
    render(<Textarea label="Grande" inputSize="lg" rows={1} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("text-lg");
  });
});
