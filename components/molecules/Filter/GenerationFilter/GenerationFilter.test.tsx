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

  it("renderiza o título e as gerações na ordem invertida", () => {
    renderComponent();
    expect(screen.getByText("Filtrar por Geração")).toBeInTheDocument();

    // Agora as primeiras 3 visíveis serão 9ª, 8ª, 7ª
    expect(screen.getByText("9ª Geração")).toBeInTheDocument();
    expect(screen.getByText("8ª Geração")).toBeInTheDocument();
    expect(screen.getByText("7ª Geração")).toBeInTheDocument();
  });

  it("marca as gerações pré-selecionadas na nova ordem", () => {
    selectedGenerations = ["9", "7"];
    renderComponent();

    const gen9Checkbox = screen.getByLabelText("9ª Geração") as HTMLInputElement;
    const gen8Checkbox = screen.getByLabelText("8ª Geração") as HTMLInputElement;
    const gen7Checkbox = screen.getByLabelText("7ª Geração") as HTMLInputElement;

    expect(gen9Checkbox.checked).toBe(true);
    expect(gen8Checkbox.checked).toBe(false);
    expect(gen7Checkbox.checked).toBe(true);
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
