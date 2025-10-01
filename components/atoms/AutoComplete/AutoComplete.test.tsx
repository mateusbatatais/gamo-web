import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AutoComplete, AutoCompleteItem } from "./AutoComplete";
import userEvent from "@testing-library/user-event";

// Mock do ImageWithFallback para simplificar os testes
vi.mock("../ImageWithFallback/ImageWithFallback", () => ({
  ImageWithFallback: ({ src, alt }: { src?: string | null; alt: string }) => (
    <div data-testid="image-with-fallback">
      {src ? <img src={src} alt={alt} /> : <div>Fallback</div>}
    </div>
  ),
}));

// Mock do Skeleton
vi.mock("../Skeleton/Skeleton", () => ({
  Skeleton: ({ className, animated }: { className?: string; animated?: boolean }) => (
    <div data-testid="skeleton" className={className} data-animated={animated}>
      Loading...
    </div>
  ),
}));

const mockItems: AutoCompleteItem[] = [
  {
    id: 1,
    label: "João Silva",
    imageUrl: "https://example.com/joao.jpg",
    type: "user",
  },
  {
    id: 2,
    label: "Maria Santos",
    imageUrl: null,
    type: "user",
  },
  {
    id: 3,
    label: "Time Dev",
    imageUrl: "https://example.com/team.jpg",
    type: "team",
  },
];

const defaultProps: React.ComponentProps<typeof AutoComplete> = {
  items: mockItems,
  onItemSelect: vi.fn(),
  onSearch: vi.fn(),
  placeholder: "Buscar...",
};

describe("AutoComplete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render input with placeholder", () => {
    render(<AutoComplete {...defaultProps} />);

    expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
  });

  it("should call onSearch when typing", async () => {
    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "test");

    await waitFor(() => {
      expect(defaultProps.onSearch).toHaveBeenCalledWith("test");
    });
  });

  it("should show dropdown when typing and items are available", async () => {
    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "jo");

    await waitFor(() => {
      expect(screen.getByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("Maria Santos")).toBeInTheDocument();
      expect(screen.getByText("Time Dev")).toBeInTheDocument();
    });
  });

  it("should call onItemSelect when item is clicked", async () => {
    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "jo");

    await waitFor(() => {
      const item = screen.getByText("João Silva");
      fireEvent.click(item);
    });

    expect(defaultProps.onItemSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  it("should close dropdown when item is selected", async () => {
    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "jo");

    await waitFor(() => {
      const item = screen.getByText("João Silva");
      fireEvent.click(item);
    });

    // Dropdown should be closed after selection
    expect(screen.queryByText("Maria Santos")).not.toBeInTheDocument();
  });

  it("should show loading state with skeletons", async () => {
    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} loading={true} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "test");

    await waitFor(() => {
      const skeletons = screen.getAllByTestId("skeleton");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  it("should show empty state when no items and input has value", async () => {
    const user = userEvent.setup();
    const emptyItemsProps = {
      ...defaultProps,
      items: [],
    };

    render(<AutoComplete {...emptyItemsProps} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "xyz");

    // Aguardar o debounce e abertura do dropdown
    await waitFor(() => {
      expect(defaultProps.onSearch).toHaveBeenCalledWith("xyz");
    });

    // Verificar se a mensagem de empty state aparece
    await waitFor(() => {
      expect(screen.getByText("Nenhum resultado encontrado")).toBeInTheDocument();
    });
  });

  it("should close dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Outside button</button>
        <AutoComplete {...defaultProps} />
      </div>,
    );

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "jo");

    await waitFor(() => {
      expect(screen.getByText("João Silva")).toBeInTheDocument();
    });

    // Click outside
    const outsideButton = screen.getByText("Outside button");
    await user.click(outsideButton);

    // Dropdown should be closed
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
  });

  it("should use custom renderItem when provided", async () => {
    const customRenderItem = vi.fn((item: AutoCompleteItem) => (
      <div data-testid={`custom-item-${item.id}`}>Custom: {item.label}</div>
    ));

    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} renderItem={customRenderItem} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "jo");

    await waitFor(() => {
      expect(customRenderItem).toHaveBeenCalled();
      expect(screen.getByTestId("custom-item-1")).toBeInTheDocument();
      expect(screen.getByText("Custom: João Silva")).toBeInTheDocument();
    });
  });

  it("should update input value when item is selected", async () => {
    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "jo");

    await waitFor(() => {
      const item = screen.getByText("João Silva");
      fireEvent.click(item);
    });

    expect(input).toHaveValue("João Silva");
  });

  it("should handle items without images", async () => {
    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "maria");

    await waitFor(() => {
      // Should render fallback for items without image
      const images = screen.getAllByTestId("image-with-fallback");
      expect(images.length).toBe(3); // Todos os 3 itens
    });
  });

  it("should display item types correctly", async () => {
    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "jo");

    await waitFor(() => {
      // Usar getAllByText e verificar se encontramos os tipos esperados
      const userTypes = screen.getAllByText("user");
      const teamType = screen.getByText("team");

      expect(userTypes.length).toBe(2); // Dois itens com type 'user'
      expect(teamType).toBeInTheDocument();
    });
  });

  it("should respect initial value prop", () => {
    render(<AutoComplete {...defaultProps} value="Valor inicial" />);

    const input = screen.getByPlaceholderText("Buscar...");
    expect(input).toHaveValue("Valor inicial");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<AutoComplete {...defaultProps} disabled={true} />);

    const input = screen.getByPlaceholderText("Buscar...");
    expect(input).toBeDisabled();
  });

  it("should not open dropdown when input is empty", () => {
    render(<AutoComplete {...defaultProps} />);

    const input = screen.getByPlaceholderText("Buscar...");
    fireEvent.focus(input);

    // Dropdown should not open when input is empty
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
  });

  it("should open dropdown on focus when input has value", async () => {
    const user = userEvent.setup();
    render(<AutoComplete {...defaultProps} value="jo" />);

    const input = screen.getByPlaceholderText("Buscar...");
    await user.click(input); // Focus no input

    await waitFor(() => {
      expect(screen.getByText("João Silva")).toBeInTheDocument();
    });
  });
});
