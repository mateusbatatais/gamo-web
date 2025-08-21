import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Drawer } from "./Drawer";

describe("Drawer component", () => {
  it("renderiza com título e children", () => {
    render(
      <Drawer title="Test Drawer" open onClose={() => {}}>
        Conteúdo do drawer
      </Drawer>,
    );

    expect(screen.getByText("Test Drawer")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do drawer")).toBeInTheDocument();
  });

  it("chama onClose quando o botão de fechar é clicado", () => {
    const handleClose = vi.fn();
    render(
      <Drawer title="Test Drawer" open onClose={handleClose}>
        Conteúdo
      </Drawer>,
    );

    fireEvent.click(screen.getByLabelText("close"));
    expect(handleClose).toHaveBeenCalled();
  });

  it("exibe ações customizadas", () => {
    render(
      <Drawer title="Test Drawer" open onClose={() => {}} actions={<button>Custom Action</button>}>
        Conteúdo
      </Drawer>,
    );

    expect(screen.getByText("Custom Action")).toBeInTheDocument();
  });

  it("aplica classes de dark mode", () => {
    render(
      <Drawer title="Test Drawer" open onClose={() => {}}>
        Conteúdo
      </Drawer>,
    );

    const title = screen.getByText("Test Drawer");
    expect(title).toHaveClass("dark:text-neutral-100");
  });
});
