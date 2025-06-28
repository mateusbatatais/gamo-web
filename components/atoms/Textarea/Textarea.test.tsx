import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Textarea } from "./Textarea";
import { Info } from "lucide-react";

describe("Textarea component", () => {
  it("associa a label ao textarea", () => {
    render(<Textarea label="Descrição" />);
    const textarea = screen.getByLabelText("Descrição");
    expect(textarea).toBeInTheDocument();
  });

  it("aplica status danger quando há erro", () => {
    render(<Textarea error="Erro" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-danger");
  });

  it("exibe ícone à esquerda", () => {
    render(<Textarea icon={<Info data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("textbox").className).toContain("pl-10");
  });

  it("aplica modo dark corretamente", () => {
    render(<Textarea />, {
      wrapper: ({ children }) => <div className="dark">{children}</div>,
    });
    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("dark:bg-gray-800");
  });
});
