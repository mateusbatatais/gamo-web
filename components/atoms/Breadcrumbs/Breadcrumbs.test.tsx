import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BreadcrumbsStorybook, BreadcrumbItem } from "./Breadcrumbs.storybook";

// Interfaces para os mocks
interface MockComponentProps {
  children?: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  href?: string;
  className?: string;
  open?: boolean;
  anchorEl?: unknown;
  onClose?: () => void;
  dense?: boolean;
  component?: string;
  "aria-label"?: string;
  "aria-haspopup"?: boolean;
  "aria-expanded"?: boolean;
  size?: string;
}

// Mock do Material-UI com tipos
vi.mock("@mui/material", () => ({
  Breadcrumbs: ({ children, ...props }: MockComponentProps) => (
    <nav aria-label="breadcrumb" {...props}>
      {children}
    </nav>
  ),
  Typography: ({
    children,
    component = "span",
    ...props
  }: MockComponentProps & { component?: string }) =>
    React.createElement(component || "span", props, children),
  IconButton: ({ children, onClick, onKeyDown, ...props }: MockComponentProps) => (
    <button onClick={onClick} onKeyDown={onKeyDown} {...props}>
      {children}
    </button>
  ),
  Menu: ({ children, open }: MockComponentProps) =>
    open ? <div role="menu">{children}</div> : null,
  MenuItem: ({ children, onClick }: MockComponentProps & { component?: string }) => (
    <button onClick={onClick} role="menuitem">
      {children}
    </button>
  ),
  Box: ({ children, ...props }: MockComponentProps) => <div {...props}>{children}</div>,
}));

// Mock do MoreVert icon
vi.mock("@mui/icons-material", () => ({
  MoreVert: () => <span data-testid="more-icon">⋯</span>,
}));

// Mock do Link do Next.js
vi.mock("next/link", () => ({
  default: ({ children, href, className }: MockComponentProps & { href: string }) => (
    <a href={href} className={className} data-testid="link">
      {children}
    </a>
  ),
}));

// Mock do Lucide React
vi.mock("lucide-react", () => ({
  HomeIcon: () => <span data-testid="home-icon">🏠</span>,
}));

describe("Breadcrumbs", () => {
  it("should render home breadcrumb", () => {
    const items: BreadcrumbItem[] = [
      { label: "Jogos", href: "/games" },
      { label: "Meu Jogo", href: "/games/my-game" },
      { label: "Configurações" },
    ];

    render(<BreadcrumbsStorybook items={items} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should render provided breadcrumbs", () => {
    const items: BreadcrumbItem[] = [
      { label: "Jogos", href: "/games" },
      { label: "Meu Jogo", href: "/games/my-game" },
      { label: "Configurações" },
    ];

    render(<BreadcrumbsStorybook items={items} />);

    expect(screen.getByText("Jogos")).toBeInTheDocument();
    expect(screen.getByText("Meu Jogo")).toBeInTheDocument();
    expect(screen.getByText("Configurações")).toBeInTheDocument();
  });

  it("should make last breadcrumb not clickable when no href", () => {
    const items: BreadcrumbItem[] = [
      { label: "Jogos", href: "/games" },
      { label: "Meu Jogo", href: "/games/my-game" },
      { label: "Configurações" },
    ];

    render(<BreadcrumbsStorybook items={items} />);

    const lastBreadcrumb = screen.getByText("Configurações");
    expect(lastBreadcrumb).toBeInTheDocument();
    expect(lastBreadcrumb.closest("a")).not.toBeInTheDocument();
  });

  it("should render breadcrumbs as links when they have href", () => {
    const items: BreadcrumbItem[] = [
      { label: "Jogos", href: "/games" },
      { label: "Meu Jogo", href: "/games/my-game" },
    ];

    render(<BreadcrumbsStorybook items={items} />);

    const gamesLink = screen.getByText("Jogos").closest("a");
    const myGameLink = screen.getByText("Meu Jogo").closest("a");

    expect(gamesLink).toHaveAttribute("href", "/games");
    expect(myGameLink).toHaveAttribute("href", "/games/my-game");
  });

  it("should show condensed menu when items exceed maxItems", () => {
    const manyItems: BreadcrumbItem[] = [
      { label: "Primeiro", href: "/first" },
      { label: "Segundo", href: "/first/second" },
      { label: "Terceiro", href: "/first/second/third" },
      { label: "Quarto", href: "/first/second/third/fourth" },
      { label: "Quinto" },
    ];

    render(<BreadcrumbsStorybook items={manyItems} condensed={true} maxItems={3} />);

    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();
    expect(screen.getByText("Quinto")).toBeInTheDocument();
  });

  it("should not show condensed menu when items are within maxItems", () => {
    const items: BreadcrumbItem[] = [
      { label: "Jogos", href: "/games" },
      { label: "Meu Jogo", href: "/games/my-game" },
    ];

    render(<BreadcrumbsStorybook items={items} condensed={true} maxItems={5} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should handle empty items array", () => {
    render(<BreadcrumbsStorybook items={[]} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.queryByText("Jogos")).not.toBeInTheDocument();
  });

  it("should render breadcrumbs with icons", () => {
    const itemsWithIcons: BreadcrumbItem[] = [
      {
        label: "Jogos",
        href: "/games",
        icon: <span data-testid="game-icon">🎮</span>,
      },
      { label: "Configurações" },
    ];

    render(<BreadcrumbsStorybook items={itemsWithIcons} />);

    expect(screen.getByTestId("game-icon")).toBeInTheDocument();
    expect(screen.getByText("Jogos")).toBeInTheDocument();
  });
});
