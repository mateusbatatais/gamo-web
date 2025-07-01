// components/molecules/SortSelect/SortSelect.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { SortSelect, SortOption } from "./SortSelect";
import { describe, it, expect, vi } from "vitest";

const mockOptions: SortOption[] = [
  { value: "name-asc", label: "Nome (A-Z)" },
  { value: "name-desc", label: "Nome (Z-A)" },
  { value: "releaseDate-asc", label: "Data de Lançamento (Mais antigos)" },
];

describe("SortSelect", () => {
  it("renderiza corretamente com opções", () => {
    const mockOnChange = vi.fn();
    render(<SortSelect options={mockOptions} value="name-asc" onChange={mockOnChange} />);

    // Verifica se o componente Select está presente
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Verifica se as opções estão renderizadas
    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("chama onChange quando uma nova opção é selecionada", () => {
    const mockOnChange = vi.fn();
    render(<SortSelect options={mockOptions} value="name-asc" onChange={mockOnChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "name-desc" } });

    expect(mockOnChange).toHaveBeenCalledWith("name-desc");
  });

  it("exibe a opção selecionada corretamente", () => {
    const mockOnChange = vi.fn();
    render(<SortSelect options={mockOptions} value="releaseDate-asc" onChange={mockOnChange} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("releaseDate-asc");
    expect(screen.getByText("Data de Lançamento (Mais antigos)")).toBeInTheDocument();
  });

  it("aplica a classe className corretamente", () => {
    const mockOnChange = vi.fn();
    render(
      <SortSelect
        options={mockOptions}
        value="name-asc"
        onChange={mockOnChange}
        className="custom-class"
      />,
    );

    const container = screen.getByTestId("sort-select-container");
    expect(container).toHaveClass("custom-class");
  });
});
