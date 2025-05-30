import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button component", () => {
  it("renderiza com o label correto", () => {
    render(<Button label="Testar" />);
    expect(screen.getByRole("button")).toHaveTextContent("Testar");
  });

  it("chama onClick quando clicado", async () => {
    const onClick = vi.fn();
    render(<Button label="Clicável" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("fica desabilitado quando a prop disabled é true", () => {
    render(<Button label="Desabilitado" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
