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
      "filters.showMore": "Exibir mais",
      "filters.showLess": "Exibir menos",
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

  it("renderiza o título e as 3 primeiras gerações (últimas)", () => {
    renderComponent();
    expect(screen.getByText("Filtrar por Geração")).toBeInTheDocument();

    // Agora as 3 primeiras visíveis são as últimas gerações
    expect(screen.getByText("9ª Geração")).toBeInTheDocument();
    expect(screen.getByText("8ª Geração")).toBeInTheDocument();
    expect(screen.getByText("7ª Geração")).toBeInTheDocument();

    // As gerações antigas não devem estar visíveis inicialmente
    expect(screen.queryByText("1ª Geração")).not.toBeInTheDocument();
    expect(screen.queryByText("2ª Geração")).not.toBeInTheDocument();
  });

  it("marca as gerações pré-selecionadas", () => {
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
    const gen9Checkbox = screen.getByLabelText("9ª Geração");

    fireEvent.click(gen9Checkbox);
    expect(mockOnGenerationChange).toHaveBeenCalledWith(["9"]);
  });

  it("chama onGenerationChange ao desselecionar uma geração", () => {
    selectedGenerations = ["9"];
    renderComponent();
    const gen9Checkbox = screen.getByLabelText("9ª Geração");

    fireEvent.click(gen9Checkbox);
    expect(mockOnGenerationChange).toHaveBeenCalledWith([]);
  });

  it("permite selecionar múltiplas gerações", () => {
    const { rerender } = renderComponent();

    const gen9Checkbox = screen.getByLabelText("9ª Geração");
    const gen8Checkbox = screen.getByLabelText("8ª Geração");

    // Primeiro clique
    fireEvent.click(gen9Checkbox);
    expect(mockOnGenerationChange).toHaveBeenCalledWith(["9"]);

    // Atualiza props
    selectedGenerations = ["9"];
    rerender(
      <GenerationFilter
        selectedGenerations={selectedGenerations}
        onGenerationChange={handleChange}
      />,
    );

    // Segundo clique
    fireEvent.click(gen8Checkbox);
    expect(mockOnGenerationChange).toHaveBeenCalledWith(["9", "8"]);
  });

  it("renderiza corretamente quando não há gerações selecionadas", () => {
    renderComponent();
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    checkboxes.forEach((checkbox) => {
      expect(checkbox.checked).toBe(false);
    });
  });

  it("mostra botão 'Exibir mais' quando há gerações adicionais", () => {
    renderComponent();
    expect(screen.getByText("Exibir mais (6)")).toBeInTheDocument();
  });

  it("expande e mostra todas as gerações ao clicar em 'Exibir mais'", () => {
    renderComponent();

    // Clica no botão "Exibir mais"
    const showMoreButton = screen.getByText("Exibir mais (6)");
    fireEvent.click(showMoreButton);

    // Agora todas as gerações devem estar visíveis
    expect(screen.getByText("9ª Geração")).toBeInTheDocument();
    expect(screen.getByText("8ª Geração")).toBeInTheDocument();
    expect(screen.getByText("7ª Geração")).toBeInTheDocument();
    expect(screen.getByText("6ª Geração")).toBeInTheDocument();
    expect(screen.getByText("5ª Geração")).toBeInTheDocument();
    expect(screen.getByText("4ª Geração")).toBeInTheDocument();
    expect(screen.getByText("3ª Geração")).toBeInTheDocument();
    expect(screen.getByText("2ª Geração")).toBeInTheDocument();
    expect(screen.getByText("1ª Geração")).toBeInTheDocument();

    // Botão deve mudar para "Exibir menos"
    expect(screen.getByText("Exibir menos")).toBeInTheDocument();
  });

  it("recolhe as gerações ao clicar em 'Exibir menos'", () => {
    renderComponent();

    // Expande primeiro
    const showMoreButton = screen.getByText("Exibir mais (6)");
    fireEvent.click(showMoreButton);

    // Agora recolhe
    const showLessButton = screen.getByText("Exibir menos");
    fireEvent.click(showLessButton);

    // Apenas as 3 primeiras devem estar visíveis
    expect(screen.getByText("9ª Geração")).toBeInTheDocument();
    expect(screen.getByText("8ª Geração")).toBeInTheDocument();
    expect(screen.getByText("7ª Geração")).toBeInTheDocument();

    // As antigas não devem estar visíveis
    expect(screen.queryByText("1ª Geração")).not.toBeInTheDocument();
    expect(screen.queryByText("2ª Geração")).not.toBeInTheDocument();
  });

  it("mantém a seleção visível mesmo ao recolher", () => {
    selectedGenerations = ["9", "1"]; // 9ª visível, 1ª (seria oculta, mas agora é visível por estar selecionada)
    renderComponent();

    // Verifica que a 9ª está selecionada
    const gen9Checkbox = screen.getByLabelText("9ª Geração") as HTMLInputElement;
    expect(gen9Checkbox.checked).toBe(true);

    // Verifica que a 1ª TAMBÉM está visível e selecionada (nova lógica)
    const gen1Checkbox = screen.getByLabelText("1ª Geração") as HTMLInputElement;
    expect(gen1Checkbox).toBeInTheDocument();
    expect(gen1Checkbox.checked).toBe(true);

    // Expande (O contador deve ser 5, pois a 1ª Geração saiu da lista de ocultos)
    const showMoreButton = screen.getByText("Exibir mais (5)");
    fireEvent.click(showMoreButton);

    // Recolhe
    const showLessButton = screen.getByText("Exibir menos");
    fireEvent.click(showLessButton);

    // Verifica que a 9ª continua selecionada
    expect(gen9Checkbox.checked).toBe(true);

    // Verifica que a 1ª continua visível e selecionada após recolher
    expect(gen1Checkbox).toBeInTheDocument();
    expect(gen1Checkbox.checked).toBe(true);
  });
});
