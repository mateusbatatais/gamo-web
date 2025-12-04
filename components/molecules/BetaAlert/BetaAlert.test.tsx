// components/molecules/BetaAlert/BetaAlert.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BetaAlert from "./BetaAlert";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";

const renderWithIntl = (ui: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="pt" messages={{ BetaAlert: { message: "Test Message" } }}>
      {ui}
    </NextIntlClientProvider>,
  );
};

describe("BetaAlert component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders when localStorage does not have the flag", () => {
    renderWithIntl(<BetaAlert />);
    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });

  it("does not render when localStorage has the flag", () => {
    localStorage.setItem("hasClosedBetaAlert", "true");
    renderWithIntl(<BetaAlert />);
    expect(screen.queryByText("Test Message")).not.toBeInTheDocument();
  });

  it("sets localStorage flag and closes when close button is clicked", () => {
    renderWithIntl(<BetaAlert />);
    const closeButton = screen.getByTestId("alert-close-button");

    fireEvent.click(closeButton);

    expect(localStorage.getItem("hasClosedBetaAlert")).toBe("true");
    expect(screen.queryByText("Test Message")).not.toBeInTheDocument();
  });
});
