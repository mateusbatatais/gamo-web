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
    render(<Radio onChange={onChange} label="Test Radio" />);

    // Clica no container do radio usando o texto da label
    await userEvent.click(screen.getByText("Test Radio"));
    expect(onChange).toHaveBeenCalled();
  });

  it("fica desabilitado quando prop disabled é true", () => {
    render(<Radio disabled label="Test Radio" />);

    // Encontra o input pelo papel "radio" com o estado hidden
    const radioInputs = screen.getAllByRole("radio", { hidden: true });
    const input = radioInputs.find((el) => el.tagName === "INPUT");
    expect(input).toBeDisabled();
  });

  it("aplica classes customizadas", () => {
    render(<Radio className="custom-class" label="Test Radio" />);

    // Encontra o input pelo papel "radio" com o estado hidden
    const radioInputs = screen.getAllByRole("radio", { hidden: true });
    const input = radioInputs.find((el) => el.tagName === "INPUT");
    expect(input).toHaveClass("custom-class");
  });

  it("exibe ponto interno quando marcado", () => {
    render(<Radio checked label="Test Radio" />);

    // Encontra o container do radio
    const radioContainers = screen.getAllByRole("radio");
    const container = radioContainers.find((el) => el.tagName === "DIV");

    // Verifica se o ponto interno está presente
    const dot = container?.querySelector("div:nth-child(3)");
    expect(dot).toBeInTheDocument();
  });

  it("não exibe ponto interno quando não marcado", () => {
    render(<Radio label="Test Radio" />);

    // Encontra o container do radio
    const radioContainers = screen.getAllByRole("radio");
    const container = radioContainers.find((el) => el.tagName === "DIV");

    // Verifica se o ponto interno não está presente
    const dot = container?.querySelector("div:nth-child(3)");
    expect(dot).toBeFalsy();
  });

  it("exibe borda vermelha quando em estado de erro", () => {
    render(<Radio error label="Test Radio" />);

    // Encontra o container do radio
    const radioContainers = screen.getAllByRole("radio");
    const container = radioContainers.find((el) => el.tagName === "DIV");

    // Verifica o círculo externo
    const circle = container?.querySelector("div:nth-child(2)");
    expect(circle).toHaveClass("border-danger");
  });

  it("exibe texto vermelho na label quando em estado de erro", () => {
    render(<Radio error label="Test label" />);
    const label = screen.getByText("Test label");
    expect(label).toHaveClass("text-danger");
  });

  it("exibe ponto vermelho quando marcado e com erro", () => {
    render(<Radio error checked label="Test Radio" />);

    // Encontra o container do radio
    const radioContainers = screen.getAllByRole("radio");
    const container = radioContainers.find((el) => el.tagName === "DIV");

    // Verifica o ponto interno
    const dot = container?.querySelector("div:nth-child(3)");
    expect(dot).toHaveClass("bg-danger");
  });

  it("exibe descrição em vermelho quando em estado de erro", () => {
    render(<Radio error description="Error description" />);
    const description = screen.getByText("Error description");
    expect(description).toHaveClass("text-danger");
  });

  it("mantém acessibilidade com aria-label", () => {
    render(<Radio aria-label="Accessible radio" />);

    // Encontra o input pelo papel "radio" com o estado hidden
    const radioInputs = screen.getAllByRole("radio", { hidden: true });
    const input = radioInputs.find((el) => el.tagName === "INPUT");
    expect(input).toHaveAttribute("aria-label", "Accessible radio");
  });

  it("responde ao clique na descrição", async () => {
    const onChange = vi.fn();
    render(<Radio description="Click me" onChange={onChange} label="Test" />);
    await userEvent.click(screen.getByText("Click me"));
    expect(onChange).toHaveBeenCalled();
  });
});

describe("Comportamento de radio isolado", () => {
  it("deve marcar quando clicado em um radio isolado", async () => {
    render(<Radio label="Radio único" />);

    // Encontra o input pelo papel "radio" com o estado hidden
    const radioInputs = screen.getAllByRole("radio", { hidden: true });
    const input = radioInputs.find((el) => el.tagName === "INPUT") as HTMLInputElement;

    // Clica usando o texto da label
    await userEvent.click(screen.getByText("Radio único"));
    expect(input.checked).toBe(true);
  });

  it("deve permanecer marcado ao clicar novamente", async () => {
    render(<Radio label="Radio único" />);

    // Encontra o input pelo papel "radio" com o estado hidden
    const radioInputs = screen.getAllByRole("radio", { hidden: true });
    const input = radioInputs.find((el) => el.tagName === "INPUT") as HTMLInputElement;

    // Primeiro clique
    await userEvent.click(screen.getByText("Radio único"));
    expect(input.checked).toBe(true);

    // Segundo clique
    await userEvent.click(screen.getByText("Radio único"));
    expect(input.checked).toBe(true); // Deve permanecer marcado
  });

  it("deve alternar corretamente quando controlado", async () => {
    const onChange = vi.fn();
    render(<Radio label="Controlado" checked={false} onChange={onChange} />);

    // Clica usando o texto da label
    await userEvent.click(screen.getByText("Controlado"));
    expect(onChange).toHaveBeenCalled();
  });
});
