// components/molecules/Pagination/Pagination.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Pagination from "./Pagination";

describe("Pagination component", () => {
  const onPageChange = vi.fn();

  beforeEach(() => {
    onPageChange.mockClear();
  });

  it("a página atual deve ter o estilo primário", () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);

    const page3Button = screen.getByRole("button", { name: "3" });
    expect(page3Button).toHaveClass("bg-primary-500");
    expect(page3Button).toHaveClass("text-white");
  });

  it("chama onPageChange ao clicar em um número de página", async () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);

    const page5Button = screen.getByRole("button", { name: "5" });
    await userEvent.click(page5Button);

    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("navega para a próxima página", async () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole("button", { name: /próxima/i });
    await userEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("navega para a página anterior", async () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole("button", { name: /anterior/i });
    await userEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("desabilita o botão anterior na primeira página", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole("button", { name: /anterior/i });
    expect(prevButton).toBeDisabled();
  });

  it("desabilita o botão próximo na última página", () => {
    render(<Pagination currentPage={10} totalPages={10} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole("button", { name: /próxima/i });
    expect(nextButton).toBeDisabled();
  });

  it("mantém a página atual selecionada após redimensionamento", () => {
    // Redimensiona a janela
    window.innerWidth = 500;

    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

    const activeButton = screen.getByRole("button", { name: "5" });
    expect(activeButton).toHaveClass("bg-primary-500");
  });
});
