import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ImagePreview } from "./ImagePreview";
import { ImgHTMLAttributes } from "react";

// Mock das traduções
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    if (key === "common.notEdited") return "Not Edited";
    return key;
  },
}));

// Mock do ImageCropper corrigido
vi.mock("../ImageCropper/ImageCropper", () => ({
  __esModule: true,
  default: ({
    onCancel,
    onBlobReady,
  }: {
    onCancel: () => void;
    onBlobReady: (blob: Blob) => void;
  }) => (
    <div data-testid="image-cropper">
      <button onClick={onCancel} data-testid="cancel-crop">
        Cancel
      </button>
      <button onClick={() => onBlobReady(new Blob())} data-testid="apply-crop">
        Apply
      </button>
    </div>
  ),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} src={props.src} alt={props.alt} data-testid="preview-image" />
  ),
}));

describe("ImagePreview component", () => {
  const onRemoveMock = vi.fn();
  const onCropCompleteMock = vi.fn();
  const testSrc = "https://example.com/test-image.jpg";

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("mostra o badge 'Not Edited' para imagens não processadas", () => {
    render(
      <ImagePreview
        src={testSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={false}
      />,
    );

    expect(screen.getByText("Not Edited")).toBeInTheDocument();
  });

  it("renderiza a imagem corretamente", () => {
    render(
      <ImagePreview
        src={testSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    const image = screen.getByRole("img", { name: "Preview" });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", testSrc);
  });
  it("chama onRemove ao clicar no botão de remover", async () => {
    const user = userEvent.setup();
    render(
      <ImagePreview
        src={testSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    const preview = screen.getByTestId("image-preview");
    await user.hover(preview);

    const removeButton = await screen.findByTestId("remove-button");
    await user.click(removeButton);

    expect(onRemoveMock).toHaveBeenCalled();
  });

  it("mostra botões de ação ao passar o mouse", async () => {
    const user = userEvent.setup();
    render(
      <ImagePreview
        src={testSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    const preview = screen.getByTestId("image-preview");
    await user.hover(preview);

    await waitFor(() => {
      expect(screen.getByTestId("edit-button")).toBeVisible();
      expect(screen.getByTestId("remove-button")).toBeVisible();
    });
  });

  it("abre o editor ao clicar no botão de editar", async () => {
    const user = userEvent.setup();
    render(
      <ImagePreview
        src={testSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    // Hover para mostrar os botões
    const preview = screen.getByTestId("image-preview");
    await user.hover(preview);

    // Espera os botões ficarem visíveis
    await waitFor(() => {
      expect(screen.getByTestId("edit-button")).toBeVisible();
    });

    // Clica no botão de editar
    const editButton = screen.getByTestId("edit-button");
    await user.click(editButton);

    // Verifica se o editor foi aberto
    expect(screen.getByTestId("image-cropper")).toBeInTheDocument();
  });

  it("fecha o editor ao cancelar", async () => {
    const user = userEvent.setup();
    render(
      <ImagePreview
        src={testSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    // Abre o editor
    const preview = screen.getByTestId("image-preview");
    await user.hover(preview);
    const editButton = await screen.findByTestId("edit-button");
    await user.click(editButton);

    // Fecha o editor
    const cancelButton = screen.getByTestId("cancel-crop");
    await user.click(cancelButton);

    // Verifica se o editor foi fechado
    await waitFor(() => {
      expect(screen.queryByTestId("image-cropper")).not.toBeInTheDocument();
    });
  });

  it("chama onCropComplete ao aplicar corte", async () => {
    const user = userEvent.setup();
    render(
      <ImagePreview
        src={testSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    // Abre o editor
    const preview = screen.getByTestId("image-preview");
    await user.hover(preview);
    const editButton = await screen.findByTestId("edit-button");
    await user.click(editButton);

    // Aplica corte
    const applyButton = screen.getByTestId("apply-crop");
    await user.click(applyButton);

    // Verifica callback
    expect(onCropCompleteMock).toHaveBeenCalledTimes(1);
    expect(onCropCompleteMock).toHaveBeenCalledWith(expect.any(Blob));
  });

  it("atualiza estado após corte aplicado", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ImagePreview
        src={testSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    // Aplica corte
    const preview = screen.getByTestId("image-preview");
    await user.hover(preview);
    const editButton = await screen.findByTestId("edit-button");
    await user.click(editButton);
    const applyButton = screen.getByTestId("apply-crop");
    await user.click(applyButton);

    // Simula atualização da src após corte
    const newSrc = "data:image/jpeg;base64,processed_image";
    rerender(
      <ImagePreview
        src={newSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    // Verifica se badge desapareceu
    await waitFor(() => {
      expect(screen.queryByText("Not Edited")).not.toBeInTheDocument();
    });
  });

  it("chama onRemove ao clicar no botão de remover", async () => {
    const user = userEvent.setup();
    render(
      <ImagePreview
        src={testSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    const preview = screen.getByTestId("image-preview");
    await user.hover(preview);

    const removeButton = await screen.findByTestId("remove-button");
    await user.click(removeButton);

    expect(onRemoveMock).toHaveBeenCalledTimes(1);
  });

  it("não mostra badge para imagens processadas", () => {
    const processedSrc = "https://example.com/processed-image.jpg";
    render(
      <ImagePreview
        src={processedSrc}
        onRemove={onRemoveMock}
        onCropComplete={onCropCompleteMock}
        initialProcessed={true}
      />,
    );

    expect(screen.queryByTestId("unprocessed-badge")).not.toBeInTheDocument();
  });
});
