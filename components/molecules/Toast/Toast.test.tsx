// __tests__/Toast.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Toast from "./Toast";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";

vi.useFakeTimers();

const renderWithIntl = (ui: React.ReactElement) => {
  const result = render(
    <NextIntlClientProvider locale="pt" messages={{}}>
      {ui}
    </NextIntlClientProvider>,
  );
  return {
    ...result,
    rerender: (ui: React.ReactElement) =>
      result.rerender(
        <NextIntlClientProvider locale="pt" messages={{}}>
          {ui}
        </NextIntlClientProvider>,
      ),
  };
};

describe("Toast component", () => {
  it("deve exibir a mensagem correta e classes de estilo para cada tipo", () => {
    const { rerender } = renderWithIntl(
      <Toast type="success" message="Tudo certo!" onClose={() => {}} />,
    );
    const container = screen.getByTestId("toast-container");

    // Mensagem
    expect(screen.getByText("Tudo certo!")).toBeInTheDocument();

    // Verifica classes para type="success"
    expect(container).toHaveClass("bg-success-100", "border-success-500", "text-success-800");

    // Faz re-render para outro tipo
    rerender(<Toast type="danger" message="Erro ocorrido" onClose={() => {}} />);
    expect(screen.getByText("Erro ocorrido")).toBeInTheDocument();
    expect(container).toHaveClass("bg-danger-100", "border-danger-500", "text-danger-800");
  });

  it("chama onClose ao clicar no botão de fechar", () => {
    const handleClose = vi.fn();
    renderWithIntl(<Toast type="info" message="Informação" onClose={handleClose} />);

    const closeButton = screen.getByTestId("toast-close-button");
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("fecha automaticamente após durationMs", () => {
    const handleClose = vi.fn();
    renderWithIntl(
      <Toast type="warning" message="Aviso" durationMs={2000} onClose={handleClose} />,
    );

    // Avança o timer em 2000ms
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("não fecha automaticamente se durationMs for 0", () => {
    const handleClose = vi.fn();
    renderWithIntl(<Toast type="warning" message="Aviso" durationMs={0} onClose={handleClose} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(handleClose).not.toHaveBeenCalled();
  });
});
