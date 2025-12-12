import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchBar } from "./SearchBar";

// Mock next/navigation
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete("search");
  });

  it("should render correctly", () => {
    render(<SearchBar searchPath="/games" />);
    expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
  });

  it("should update input value when typing", () => {
    render(<SearchBar searchPath="/games" />);
    const input = screen.getByPlaceholderText("Buscar...");
    fireEvent.change(input, { target: { value: "Mario" } });
    expect(input).toHaveValue("Mario");
  });

  it("should navigate on Enter key press", () => {
    render(<SearchBar searchPath="/games" />);
    const input = screen.getByPlaceholderText("Buscar...");

    fireEvent.change(input, { target: { value: "Zelda" } });
    fireEvent.keyDown(input, { key: "Enter" });

    const expectedParams = new URLSearchParams();
    expectedParams.set("search", "Zelda");
    expectedParams.set("page", "1");

    expect(mockPush).toHaveBeenCalledWith(`/games?${expectedParams.toString()}`);
  });

  it("should show clear button when there is text and clear it on click", () => {
    render(<SearchBar searchPath="/games" />);
    const input = screen.getByTestId("search-input");

    // Initially clear button should not be visible
    expect(screen.queryByLabelText("clearSearch")).not.toBeInTheDocument();

    // Type something
    fireEvent.change(input, { target: { value: "Sonic" } });

    // Clear button should be visible now
    const clearButton = screen.getByLabelText("clearSearch");
    expect(clearButton).toBeInTheDocument();

    // Click clear
    fireEvent.click(clearButton);

    // Input should be empty
    expect(input).toHaveValue("");

    // Check if URL was updated (search param removed)
    expect(mockPush).toHaveBeenCalledWith(`/games?`);

    expect(input).toHaveFocus();
  });
});
