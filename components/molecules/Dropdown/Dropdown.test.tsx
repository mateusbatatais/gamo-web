// components/molecules/Dropdown/Dropdown.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Dropdown } from "./Dropdown";

// Mock do MUI para simplificar testes
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Menu: ({ children }: React.PropsWithChildren<object>) => (
      <div data-testid="menu-mock">{children}</div>
    ),
  };
});

describe("Dropdown component", () => {
  const mockItems = [
    { id: "1", label: "Editar", onClick: vi.fn() },
    { id: "2", label: "Excluir", onClick: vi.fn() },
  ];

  it("renderiza com trigger padrão", () => {
    render(<Dropdown items={mockItems} label="Menu" />);
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("abre o menu ao clicar no trigger", async () => {
    const user = userEvent.setup();
    render(<Dropdown items={mockItems} label="Menu" />);

    await user.click(screen.getByText("Menu"));
    expect(screen.getByTestId("menu-mock")).toBeInTheDocument();
  });

  it("executa ação ao clicar em um item", async () => {
    const user = userEvent.setup();
    render(<Dropdown items={mockItems} label="Menu" />);

    await user.click(screen.getByText("Menu"));
    await user.click(screen.getByText("Editar"));

    expect(mockItems[0].onClick).toHaveBeenCalled();
  });
});
