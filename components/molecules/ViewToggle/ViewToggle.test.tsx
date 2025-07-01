// components/molecules/ViewToggle/ViewToggle.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ViewToggle } from "./ViewToggle";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock simples do componente Button
vi.mock("@/components/atoms/Button/Button", () => ({
  Button: vi.fn(({ onClick, variant, icon, ...props }) => (
    <button onClick={onClick} data-variant={variant} {...props}>
      {icon}
    </button>
  )),
}));

describe("ViewToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renderiza os botões de visualização", () => {
    render(<ViewToggle />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  //   it("botões têm os ícones corretos", () => {
  //     render(<ViewToggle />);

  //     const gridIcon = document.querySelector('[data-icon="layout-grid"]');
  //     const listIcon = document.querySelector('[data-icon="list"]');

  //     expect(gridIcon).toBeInTheDocument();
  //     expect(listIcon).toBeInTheDocument();
  //   });

  it("muda a visualização quando os botões são clicados", () => {
    const mockOnChange = vi.fn();
    render(<ViewToggle onViewChange={mockOnChange} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]); // Clica no botão de lista

    expect(mockOnChange).toHaveBeenCalledWith("list");
  });

  it("atualiza as variants ao mudar a visualização", () => {
    render(<ViewToggle />);

    const buttons = screen.getAllByRole("button");

    // Inicialmente grid ativo
    expect(buttons[0]).toHaveAttribute("data-variant", "outline");
    expect(buttons[1]).toHaveAttribute("data-variant", "transparent");

    // Clica na lista
    fireEvent.click(buttons[1]);

    // Após clique
    expect(buttons[0]).toHaveAttribute("data-variant", "transparent");
    expect(buttons[1]).toHaveAttribute("data-variant", "outline");
  });

  it("salva a preferência no localStorage", () => {
    render(<ViewToggle storageKey="test-view" />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]); // Clica no botão de lista

    expect(localStorage.getItem("test-view")).toBe("list");
  });

  it("carrega a preferência do localStorage", () => {
    localStorage.setItem("test-view", "list");
    render(<ViewToggle storageKey="test-view" />);

    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toHaveAttribute("data-variant", "outline");
  });

  it("usa a visualização padrão quando não há valor no localStorage", () => {
    render(<ViewToggle defaultView="list" />);

    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toHaveAttribute("data-variant", "outline");
  });
});
