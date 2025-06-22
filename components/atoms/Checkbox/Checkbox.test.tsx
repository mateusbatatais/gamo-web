import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "./Checkbox";
import { describe, it, expect, vi } from "vitest";

describe("Checkbox", () => {
  it("renders correctly", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("displays label", () => {
    render(<Checkbox label="Test Checkbox" />);
    expect(screen.getByText("Test Checkbox")).toBeInTheDocument();
  });

  it("handles click", () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();
  });

  it("respects disabled prop", () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("positions label correctly", () => {
    render(<Checkbox label="Left Label" labelPosition="left" />);
    const label = screen.getByText("Left Label");
    expect(label.previousElementSibling).toBeNull();
  });
});
