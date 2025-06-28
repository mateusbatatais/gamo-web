import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GenerationFilter from "./GenerationFilter";

// Mock do next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      "filters.generation.label": "Filtrar por Geração",
      "filters.generation.1": "1ª Geração",
      "filters.generation.2": "2ª Geração",
      "filters.generation.3": "3ª Geração",
      "filters.generation.4": "4ª Geração",
      "filters.generation.5": "5ª Geração",
      "filters.generation.6": "6ª Geração",
      "filters.generation.7": "7ª Geração",
      "filters.generation.8": "8ª Geração",
      "filters.generation.9": "9ª Geração",
    };
    return translations[key] || key;
  }),
}));

describe("GenerationFilter Component", () => {
  const mockOnGenerationChange = vi.fn();
  let selectedGenerations: string[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    selectedGenerations = [];
  });

  const handleChange = (newSelected: string[]) => {
    selectedGenerations = newSelected;
    mockOnGenerationChange(newSelected);
  };

  const renderComponent = () => {
    return render(
      <GenerationFilter
        selectedGenerations={selectedGenerations}
        onGenerationChange={handleChange}
      />,
    );
  };

  it("renderiza o título e todas as gerações", () => {
    renderComponent();
    expect(screen.getByText("Filtrar por Geração")).toBeInTheDocument();
    expect(screen.getByText("1ª Geração")).toBeInTheDocument();
    expect(screen.getByText("9ª Geração")).toBeInTheDocument();
  });

  it("marca as gerações pré-selecionadas", () => {
    selectedGenerations = ["1", "3"];
    renderComponent();

    const gen1Checkbox = screen.getByLabelText("1ª Geração") as HTMLInputElement;
    const gen2Checkbox = screen.getByLabelText("2ª Geração") as HTMLInputElement;
    const gen3Checkbox = screen.getByLabelText("3ª Geração") as HTMLInputElement;

    expect(gen1Checkbox.checked).toBe(true);
    expect(gen2Checkbox.checked).toBe(false);
    expect(gen3Checkbox.checked).toBe(true);
  });

  it("chama onGenerationChange ao selecionar uma geração", () => {
    renderComponent();
    const gen1Checkbox = screen.getByLabelText("1ª Geração");

    fireEvent.click(gen1Checkbox);
    expect(mockOnGenerationChange).toHaveBeenCalledWith(["1"]);
  });

  it("chama onGenerationChange ao desselecionar uma geração", () => {
    selectedGenerations = ["1"];
    renderComponent();
    const gen1Checkbox = screen.getByLabelText("1ª Geração");

    fireEvent.click(gen1Checkbox);
    expect(mockOnGenerationChange).toHaveBeenCalledWith([]);
  });

  it("permite selecionar múltiplas gerações", () => {
    const { rerender } = renderComponent();

    const gen1Checkbox = screen.getByLabelText("1ª Geração");
    const gen2Checkbox = screen.getByLabelText("2ª Geração");

    // Primeiro clique
    fireEvent.click(gen1Checkbox);
    expect(mockOnGenerationChange).toHaveBeenCalledWith(["1"]);

    // Atualiza props
    selectedGenerations = ["1"];
    rerender(
      <GenerationFilter
        selectedGenerations={selectedGenerations}
        onGenerationChange={handleChange}
      />,
    );

    // Segundo clique
    fireEvent.click(gen2Checkbox);
    expect(mockOnGenerationChange).toHaveBeenCalledWith(["1", "2"]);
  });

  it("renderiza corretamente quando não há gerações selecionadas", () => {
    renderComponent();
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    checkboxes.forEach((checkbox) => {
      expect(checkbox.checked).toBe(false);
    });
  });
});
