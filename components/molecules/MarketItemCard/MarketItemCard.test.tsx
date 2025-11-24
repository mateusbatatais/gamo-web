// components/molecules/MarketItemCard/MarketItemCard.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MarketItemCard from "./MarketItemCard";
import { MarketItem } from "@/@types/catalog.types";

// Mock dependencies
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/hooks/useSafeImageUrl", () => ({
  useSafeImageUrl: () => ({
    getSafeImageUrl: (url: string) => url || "/placeholder.png",
  }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("MarketItemCard", () => {
  const mockItem: MarketItem = {
    id: 1,
    userSlug: "user-test",
    userName: "Test User",
    image: "https://example.com/image.jpg",
    status: "SELLING",
    price: 150.0,
    condition: "EXCELLENT",
    hasBox: true,
    hasManual: true,
    acceptsTrade: true,
    sellerPhone: "5511999999999",
    createdAt: new Date("2024-01-15"),
    userId: 0,
  };

  it("renderiza o card com todas as informações do item", () => {
    render(<MarketItemCard item={mockItem} />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("R$ 150,00")).toBeInTheDocument();
    expect(screen.getByText("selling")).toBeInTheDocument();
    expect(screen.getByText("EXCELLENT")).toBeInTheDocument();
  });

  it("exibe badge de 'aceita troca' quando acceptsTrade é true", () => {
    render(<MarketItemCard item={mockItem} />);

    const tradeIcon = screen.getByTitle("acceptsTrade");
    expect(tradeIcon).toBeInTheDocument();
  });

  it("não exibe badge de 'aceita troca' quando acceptsTrade é false", () => {
    const itemWithoutTrade = { ...mockItem, acceptsTrade: false };
    render(<MarketItemCard item={itemWithoutTrade} />);

    const tradeIcon = screen.queryByTitle("acceptsTrade");
    expect(tradeIcon).not.toBeInTheDocument();
  });

  it("exibe badge 'looking' quando status é LOOKING_FOR", () => {
    const lookingItem = { ...mockItem, status: "LOOKING_FOR" as const };
    render(<MarketItemCard item={lookingItem} />);

    expect(screen.getByText("looking")).toBeInTheDocument();
  });

  it("exibe badges de caixa e manual quando disponíveis", () => {
    render(<MarketItemCard item={mockItem} />);

    expect(screen.getByText("box")).toBeInTheDocument();
    expect(screen.getByText("manual")).toBeInTheDocument();
  });

  it("não exibe badges de caixa e manual quando não disponíveis", () => {
    const itemWithoutBoxManual = {
      ...mockItem,
      hasBox: false,
      hasManual: false,
    };
    render(<MarketItemCard item={itemWithoutBoxManual} />);

    expect(screen.queryByText("box")).not.toBeInTheDocument();
    expect(screen.queryByText("manual")).not.toBeInTheDocument();
  });

  it("não exibe preço quando price é null", () => {
    const itemWithoutPrice = { ...mockItem, price: null };
    render(<MarketItemCard item={itemWithoutPrice} />);

    expect(screen.queryByText(/R\$/)).not.toBeInTheDocument();
  });

  it("formata a data corretamente", () => {
    render(<MarketItemCard item={mockItem} />);

    const formattedDate = new Date("2024-01-15").toLocaleDateString("pt-BR");
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it("exibe botão do WhatsApp quando sellerPhone está disponível", () => {
    render(<MarketItemCard item={mockItem} />);

    const whatsappButton = screen.getByRole("button");
    expect(whatsappButton).toBeInTheDocument();
  });

  it("não exibe botão do WhatsApp quando sellerPhone não está disponível", () => {
    const itemWithoutPhone = { ...mockItem, sellerPhone: null };
    render(<MarketItemCard item={itemWithoutPhone} />);

    const whatsappButton = screen.queryByRole("button");
    expect(whatsappButton).not.toBeInTheDocument();
  });

  it("abre WhatsApp em nova aba quando botão é clicado", async () => {
    const user = userEvent.setup();
    const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<MarketItemCard item={mockItem} />);

    const whatsappButton = screen.getByRole("button");
    await user.click(whatsappButton);

    expect(windowOpenSpy).toHaveBeenCalledWith("https://wa.me/5511999999999", "_blank");

    windowOpenSpy.mockRestore();
  });

  it("cria link correto para perfil do usuário com tradetype=selling", () => {
    const { container } = render(<MarketItemCard item={mockItem} />);

    const userLink = container.querySelector('a[href*="/user/user-test"]');
    expect(userLink).toBeInTheDocument();
  });

  it("cria link correto para perfil do usuário com tradetype=looking", () => {
    const lookingItem = { ...mockItem, status: "LOOKING_FOR" as const };
    const { container } = render(<MarketItemCard item={lookingItem} />);

    const marketLink = container.querySelector(
      'a[href="/user/user-test/market?tradetype=looking"]',
    );
    expect(marketLink).toBeInTheDocument();
  });

  it("renderiza imagem com src correto", () => {
    render(<MarketItemCard item={mockItem} />);

    const image = screen.getByAltText("Item de Test User");
    expect(image).toBeInTheDocument();
  });

  it("usa imagem placeholder quando image é null", () => {
    const itemWithoutImage = { ...mockItem, image: null };
    render(<MarketItemCard item={itemWithoutImage} />);

    const image = screen.getByAltText("Item de Test User");
    expect(image).toBeInTheDocument();
  });
});
