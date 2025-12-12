import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SharePopover } from "./SharePopover";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock navigations
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

window.open = vi.fn();

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      share: "Compartilhar",
      copyLink: "Copiar Link",
      copied: "Copiado!",
    };
    return translations[key] || key;
  },
}));

describe("SharePopover", () => {
  const defaultProps = {
    url: "https://test.com",
    title: "Test Title",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trigger button", () => {
    render(<SharePopover {...defaultProps} />);
    const trigger = screen.getByRole("button", { name: "Compartilhar" });
    expect(trigger).toBeInTheDocument();
  });

  it("opens popover on click", async () => {
    render(<SharePopover {...defaultProps} />);
    const trigger = screen.getByRole("button", { name: "Compartilhar" });

    fireEvent.click(trigger);

    await waitFor(() => {
      // Look for buttons by their icons or titles
      expect(screen.getByRole("button", { name: "Copiar Link" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "WhatsApp" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "X (Twitter)" })).toBeInTheDocument();
    });
  });

  it("copies link to clipboard", async () => {
    render(<SharePopover {...defaultProps} />);
    const trigger = screen.getByRole("button", { name: "Compartilhar" });
    fireEvent.click(trigger);

    const copyBtn = await screen.findByRole("button", { name: "Copiar Link" });
    fireEvent.click(copyBtn);

    expect(mockWriteText).toHaveBeenCalledWith(defaultProps.url);
  });

  it("opens whatsapp", async () => {
    render(<SharePopover {...defaultProps} />);
    const trigger = screen.getByRole("button", { name: "Compartilhar" });
    fireEvent.click(trigger);

    const waBtn = await screen.findByRole("button", { name: "WhatsApp" });
    fireEvent.click(waBtn);

    expect(window.open).toHaveBeenCalledWith(expect.stringContaining("https://wa.me/"), "_blank");
  });

  it("opens X", async () => {
    render(<SharePopover {...defaultProps} />);
    const trigger = screen.getByRole("button", { name: "Compartilhar" });
    fireEvent.click(trigger);

    const xBtn = await screen.findByRole("button", { name: "X (Twitter)" });
    fireEvent.click(xBtn);

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining("https://twitter.com/intent/tweet"),
      "_blank",
    );
  });
});
