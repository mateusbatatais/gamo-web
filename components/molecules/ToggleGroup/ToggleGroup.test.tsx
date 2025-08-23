import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ToggleGroup } from "./ToggleGroup";

describe("ToggleGroup component", () => {
  const items = [
    { value: "selling", label: "Vendendo" },
    { value: "looking", label: "Buscando" },
  ];

  it("renderiza os botões com as labels", () => {
    render(<ToggleGroup items={items} value="selling" onChange={() => {}} />);
    expect(screen.getByText("Vendendo")).toBeInTheDocument();
    expect(screen.getByText("Buscando")).toBeInTheDocument();
  });

  it("chama onChange quando um botão é clicado", async () => {
    const onChange = vi.fn();
    render(<ToggleGroup items={items} value="selling" onChange={onChange} />);
    await userEvent.click(screen.getByText("Buscando"));
    expect(onChange).toHaveBeenCalledWith("looking");
  });

  it("aplica a classe de tamanho sm", () => {
    render(<ToggleGroup items={items} value="selling" onChange={() => {}} size="sm" />);
    const button = screen.getByText("Vendendo");
    expect(button.className).toContain("text-sm");
  });

  it("renderiza ícones quando fornecidos", () => {
    const itemsWithIcons = [
      { value: "selling", label: "Vendendo", icon: <span data-testid="icon-selling">🎮</span> },
      { value: "looking", label: "Buscando", icon: <span data-testid="icon-looking">🔍</span> },
    ];
    render(<ToggleGroup items={itemsWithIcons} value="selling" onChange={() => {}} />);
    expect(screen.getByTestId("icon-selling")).toBeInTheDocument();
    expect(screen.getByTestId("icon-looking")).toBeInTheDocument();
  });

  it("aplica classes de arredondamento corretas", () => {
    render(<ToggleGroup items={items} value="selling" onChange={() => {}} />);
    const sellingButton = screen.getByText("Vendendo");
    const lookingButton = screen.getByText("Buscando");

    expect(sellingButton.className).toContain("!rounded-l-md");
    expect(lookingButton.className).toContain("!rounded-r-md");
  });

  it("aplica opacidade reduzida para itens não selecionados", () => {
    render(<ToggleGroup items={items} value="selling" onChange={() => {}} />);
    const sellingButton = screen.getByText("Vendendo");
    const lookingButton = screen.getByText("Buscando");

    expect(sellingButton.className).toContain("opacity-100");
    expect(lookingButton.className).toContain("opacity-70");
  });

  it("remove borda direita para variante outline", () => {
    render(<ToggleGroup items={items} value="selling" onChange={() => {}} variant="outline" />);
    const sellingButton = screen.getByText("Vendendo");
    const lookingButton = screen.getByText("Buscando");

    expect(sellingButton.className).toContain("border-r-0");
    expect(lookingButton.className).not.toContain("border-r-0");
  });
});
