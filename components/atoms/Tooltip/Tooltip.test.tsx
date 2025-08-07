import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";

describe("Tooltip component", () => {
  it("deve exibir o tooltip ao passar o mouse", async () => {
    render(
      <Tooltip title="Tooltip de teste">
        <Button>Trigger</Button>
      </Tooltip>,
    );

    const button = screen.getByText("Trigger");
    fireEvent.mouseOver(button);

    // Espera o tooltip aparecer no DOM
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    expect(await screen.findByText("Tooltip de teste")).toBeInTheDocument();
  });

  it("deve mudar o estilo com a variante light", async () => {
    render(
      <Tooltip title="Tooltip light" variant="light">
        <Button>Trigger</Button>
      </Tooltip>,
    );

    const button = screen.getByText("Trigger");
    fireEvent.mouseOver(button);

    // Espera o tooltip aparecer e verifica as classes
    const tooltip = await screen.findByRole("tooltip");
    const content = tooltip.querySelector(".MuiTooltip-tooltip > div");

    expect(content).toHaveClass("bg-neutral-100");
    expect(content).toHaveClass("text-neutral-800");
  });

  it("deve posicionar na parte inferior quando especificado", async () => {
    render(
      <Tooltip title="Tooltip bottom" placement="bottom">
        <Button>Trigger</Button>
      </Tooltip>,
    );

    const button = screen.getByText("Trigger");
    fireEvent.mouseOver(button);

    // Verifica o atributo de posicionamento
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveAttribute("data-popper-placement", "bottom");
  });
});
