// components/molecules/Alert/Alert.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Alert from "./Alert";
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

describe("Alert component", () => {
  it("renders correctly with message and type styles", () => {
    const { rerender } = renderWithIntl(<Alert type="success" message="Success Message" />);
    const container = screen.getByTestId("alert-container");

    expect(screen.getByText("Success Message")).toBeInTheDocument();
    expect(container).toHaveClass("bg-success-100", "border-success-500", "text-success-800");

    rerender(<Alert type="danger" message="Error Message" />);
    expect(screen.getByText("Error Message")).toBeInTheDocument();
    expect(container).toHaveClass("bg-danger-100", "border-danger-500", "text-danger-800");
  });

  it("applies positioning classes correctly", () => {
    const { rerender } = renderWithIntl(<Alert message="Position Test" position="top-left" />);
    const container = screen.getByTestId("alert-container");
    expect(container).toHaveClass("fixed", "top-4", "left-4");

    rerender(<Alert message="Position Test" position="bottom-center" />);
    expect(container).toHaveClass("fixed", "bottom-4", "left-1/2", "-translate-x-1/2");
  });

  it("closes when close button is clicked", () => {
    const handleClose = vi.fn();
    renderWithIntl(<Alert message="Close Test" onClose={handleClose} />);

    const closeButton = screen.getByTestId("alert-close-button");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("alert-container")).not.toBeInTheDocument();
  });

  it("auto-closes after durationMs", () => {
    const handleClose = vi.fn();
    renderWithIntl(<Alert message="Auto Close Test" durationMs={2000} onClose={handleClose} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("alert-container")).not.toBeInTheDocument();
  });

  it("does not auto-close if durationMs is 0", () => {
    const handleClose = vi.fn();
    renderWithIntl(<Alert message="No Auto Close" durationMs={0} onClose={handleClose} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(handleClose).not.toHaveBeenCalled();
    expect(screen.getByTestId("alert-container")).toBeInTheDocument();
  });
});
