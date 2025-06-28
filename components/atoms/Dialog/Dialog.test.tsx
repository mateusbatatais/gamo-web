import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Dialog } from "./Dialog";
import { Button } from "../Button/Button";

describe("Dialog component", () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza corretamente com título e conteúdo", () => {
    render(
      <Dialog open title="Test Dialog" onClose={mockOnClose}>
        <div data-testid="dialog-content">Dialog content</div>
      </Dialog>,
    );

    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
  });

  it("exibe o subtítulo quando fornecido", () => {
    render(<Dialog open title="Test Dialog" subtitle="Test Subtitle" onClose={mockOnClose} />);

    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("exibe ícone quando fornecido", () => {
    render(
      <Dialog
        open
        title="Test Dialog"
        onClose={mockOnClose}
        icon={<div data-testid="dialog-icon">Icon</div>}
      />,
    );

    expect(screen.getByTestId("dialog-icon")).toBeInTheDocument();
  });

  it("fecha quando o botão de fechar (ícone) é clicado", () => {
    render(<Dialog open title="Test Dialog" onClose={mockOnClose} />);

    fireEvent.click(screen.getByLabelText("close"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("fecha quando o botão de fechar (texto) é clicado", () => {
    render(<Dialog open title="Test Dialog" onClose={mockOnClose} closeButtonVariant="text" />);

    fireEvent.click(screen.getByText("Fechar"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renderiza ações customizadas", () => {
    render(
      <Dialog
        open
        title="Test Dialog"
        onClose={mockOnClose}
        actions={<Button label="Custom Action" />}
      />,
    );

    expect(screen.getByText("Custom Action")).toBeInTheDocument();
  });

  it("renderiza botões de ação padrão", () => {
    render(
      <Dialog
        open
        title="Test Dialog"
        onClose={mockOnClose}
        actionButtons={{
          cancel: { label: "Cancel" },
          confirm: { label: "Confirm" },
        }}
      />,
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });
});
