// components/atoms/FavoriteToggle/FavoriteToggle.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteToggle } from "./FavoriteToggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock dependencies
const mockToggleFavorite = vi.fn();
const mockUseFavorite = vi.fn();

vi.mock("@/hooks/useFavorite", () => ({
  useFavorite: () => mockUseFavorite(),
}));

describe("FavoriteToggle", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockUseFavorite.mockReturnValue({
      toggleFavorite: mockToggleFavorite,
      isPending: false,
    });
  });

  const renderWithClient = (ui: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };

  it("renderiza botão de favorito corretamente", () => {
    renderWithClient(
      <FavoriteToggle itemId={1} itemType="GAME" isFavorite={false} queryKey={["games"]} />,
    );

    const button = screen.getByRole("button", {
      name: "Adicionar aos favoritos",
    });
    expect(button).toBeInTheDocument();
  });

  it("exibe coração preenchido quando isFavorite é true", () => {
    renderWithClient(
      <FavoriteToggle itemId={1} itemType="GAME" isFavorite={true} queryKey={["games"]} />,
    );

    const button = screen.getByRole("button", {
      name: "Remover dos favoritos",
    });
    expect(button).toBeInTheDocument();
  });

  it("chama toggleFavorite quando clicado", async () => {
    const user = userEvent.setup();
    mockToggleFavorite.mockResolvedValue(undefined);

    renderWithClient(
      <FavoriteToggle itemId={1} itemType="GAME" isFavorite={false} queryKey={["games"]} />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(mockToggleFavorite).toHaveBeenCalledWith({
        itemId: 1,
        itemType: "GAME",
      });
    });
  });

  it("desabilita botão quando favoriteLoading é true", () => {
    mockUseFavorite.mockReturnValue({
      toggleFavorite: mockToggleFavorite,
      isPending: true,
    });

    renderWithClient(
      <FavoriteToggle itemId={1} itemType="GAME" isFavorite={false} queryKey={["games"]} />,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("não chama toggleFavorite quando já está carregando", async () => {
    const user = userEvent.setup();
    mockUseFavorite.mockReturnValue({
      toggleFavorite: mockToggleFavorite,
      isPending: true,
    });

    renderWithClient(
      <FavoriteToggle itemId={1} itemType="GAME" isFavorite={false} queryKey={["games"]} />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockToggleFavorite).not.toHaveBeenCalled();
  });

  it("funciona com itemType CONSOLE", async () => {
    const user = userEvent.setup();
    mockToggleFavorite.mockResolvedValue(undefined);

    renderWithClient(
      <FavoriteToggle itemId={2} itemType="CONSOLE" isFavorite={false} queryKey={["consoles"]} />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(mockToggleFavorite).toHaveBeenCalledWith({
        itemId: 2,
        itemType: "CONSOLE",
      });
    });
  });

  it("funciona com itemType ACCESSORY", async () => {
    const user = userEvent.setup();
    mockToggleFavorite.mockResolvedValue(undefined);

    renderWithClient(
      <FavoriteToggle
        itemId={3}
        itemType="ACCESSORY"
        isFavorite={false}
        queryKey={["accessories"]}
      />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(mockToggleFavorite).toHaveBeenCalledWith({
        itemId: 3,
        itemType: "ACCESSORY",
      });
    });
  });

  it("aplica className customizado", () => {
    renderWithClient(
      <FavoriteToggle
        itemId={1}
        itemType="GAME"
        isFavorite={false}
        queryKey={["games"]}
        className="custom-class"
      />,
    );

    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class");
  });

  it("permite configurar tamanho do botão", () => {
    renderWithClient(
      <FavoriteToggle
        itemId={1}
        itemType="GAME"
        isFavorite={false}
        queryKey={["games"]}
        size="lg"
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("permite configurar variante do botão", () => {
    renderWithClient(
      <FavoriteToggle
        itemId={1}
        itemType="GAME"
        isFavorite={false}
        queryKey={["games"]}
        variant="primary"
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
