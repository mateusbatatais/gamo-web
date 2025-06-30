import { describe, it, expect, vi, beforeEach } from "vitest"; // Importação correta
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BrandFilter from "./BrandFilter";
import { apiFetch } from "@/utils/api";

// Mock das dependências externas
vi.mock("@/utils/api", () => ({
  apiFetch: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      "common.loading": "Carregando...",
      "filters.brand.label": "Filtrar por marca",
    };
    return translations[key] || key;
  }),
}));

describe("BrandFilter Component", () => {
  const mockBrands = [
    { slug: "sony", id: 1 },
    { slug: "nintendo", id: 2 },
    { slug: "microsoft", id: 3 },
  ];

  const mockOnBrandChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe mensagem de erro quando a requisição falha", async () => {
    const errorMessage = "Erro na conexão";
    vi.mocked(apiFetch).mockRejectedValue(new Error(errorMessage));

    render(<BrandFilter selectedBrands={[]} onBrandChange={mockOnBrandChange} />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("exibe marcas pré-selecionadas corretamente", async () => {
    vi.mocked(apiFetch).mockResolvedValue(mockBrands);

    render(
      <BrandFilter selectedBrands={["sony", "microsoft"]} onBrandChange={mockOnBrandChange} />,
    );

    await waitFor(() => {
      const sonyCheckbox = screen.getByLabelText("Sony") as HTMLInputElement;
      const microsoftCheckbox = screen.getByLabelText("Microsoft") as HTMLInputElement;
      const nintendoCheckbox = screen.getByLabelText("Nintendo") as HTMLInputElement;

      expect(sonyCheckbox.checked).toBe(true);
      expect(microsoftCheckbox.checked).toBe(true);
      expect(nintendoCheckbox.checked).toBe(false);
    });
  });

  it("formata os labels corretamente (primeira letra maiúscula)", async () => {
    vi.mocked(apiFetch).mockResolvedValue([
      { slug: "playstation", id: 4 },
      { slug: "xbox", id: 5 },
    ]);

    render(<BrandFilter selectedBrands={[]} onBrandChange={mockOnBrandChange} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Playstation")).toBeInTheDocument();
      expect(screen.getByLabelText("Xbox")).toBeInTheDocument();
    });
  });

  it("renderiza marcas corretamente após carregamento", async () => {
    vi.mocked(apiFetch).mockResolvedValue(mockBrands);

    render(<BrandFilter selectedBrands={[]} onBrandChange={mockOnBrandChange} />);

    // Aguarda o título aparecer primeiro
    await screen.findByText("Filtrar por marca");

    // Depois verifica as marcas
    expect(screen.getByLabelText("Sony")).toBeInTheDocument();
    expect(screen.getByLabelText("Nintendo")).toBeInTheDocument();
    expect(screen.getByLabelText("Microsoft")).toBeInTheDocument();
  });

  it("permite selecionar e desselecionar marcas", async () => {
    vi.mocked(apiFetch).mockResolvedValue(mockBrands);

    // Iniciamos com selectedBrands vazio
    const { rerender } = render(
      <BrandFilter selectedBrands={[]} onBrandChange={mockOnBrandChange} />,
    );

    const sonyCheckbox = await screen.findByLabelText("Sony");

    // Primeiro clique: adiciona
    fireEvent.click(sonyCheckbox);
    expect(mockOnBrandChange).toHaveBeenCalledWith(["sony"]);

    // Simulamos a atualização das props pelo componente pai
    rerender(<BrandFilter selectedBrands={["sony"]} onBrandChange={mockOnBrandChange} />);

    // Segundo clique: remove
    fireEvent.click(sonyCheckbox);
    expect(mockOnBrandChange).toHaveBeenCalledWith([]);
  });
});
