import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ImageCropper from "./ImageCropper"; // Ajuste o caminho conforme necessário

// Mock da função useTranslations
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      "crop.cancelCrop": "Cancelar",
      "crop.confirmCrop": "Confirmar",
    };
    return translations[key] || key;
  }),
}));

describe("ImageCropper Component", () => {
  const mockOnBlobReady = vi.fn();
  const mockSetFileSrc = vi.fn();
  const imageSrc = "http://example.com/image.jpg"; // Coloque uma URL de imagem válida para o teste
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it("renderiza corretamente o componente", () => {
    render(
      <ImageCropper src={imageSrc} onBlobReady={mockOnBlobReady} setFileSrc={mockSetFileSrc} />,
    );

    // Verifica se a imagem é exibida
    expect(screen.getByAltText("Crop preview")).toBeInTheDocument();
    // Verifica se os botões de ação estão presentes
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });

  it("chama setFileSrc com null ao cancelar o corte", () => {
    render(
      <ImageCropper src={imageSrc} onBlobReady={mockOnBlobReady} setFileSrc={mockSetFileSrc} />,
    );

    // Simula o clique no botão de cancelamento
    fireEvent.click(screen.getByText("Cancelar"));

    // Verifica se a função setFileSrc foi chamada com null
    expect(mockSetFileSrc).toHaveBeenCalledWith(null);
  });

  it("inicializa corretamente o corte de imagem", async () => {
    render(
      <ImageCropper src={imageSrc} onBlobReady={mockOnBlobReady} setFileSrc={mockSetFileSrc} />,
    );

    // Aguarda o carregamento da imagem e a inicialização do corte
    await waitFor(() => screen.getByAltText("Crop preview"));

    // Verifica se a imagem foi carregada e a área de corte foi configurada
    const image = screen.getByAltText("Crop preview");
    expect(image).toBeInTheDocument();
  });

  it("fecha com a tecla ESC", () => {
    render(
      <ImageCropper
        src={imageSrc}
        onBlobReady={mockOnBlobReady}
        setFileSrc={mockSetFileSrc}
        onCancel={mockOnCancel}
      />,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("não renderiza quando fechado", () => {
    const { container } = render(
      <ImageCropper src={imageSrc} onBlobReady={mockOnBlobReady} setFileSrc={mockSetFileSrc} />,
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(container).toBeEmptyDOMElement();
  });
});
