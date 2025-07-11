import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Collapse } from "./Collapse";

describe("Collapse component", () => {
  it("renderiza o título", () => {
    render(<Collapse title="Meu Título">Conteúdo</Collapse>);
    expect(screen.getByText("Meu Título")).toBeInTheDocument();
  });

  it("inicia fechado por padrão", () => {
    render(<Collapse title="Título">Conteúdo</Collapse>);
    expect(screen.queryByText("Conteúdo")).not.toBeInTheDocument();
  });

  it("inicia aberto quando defaultOpen é true", () => {
    render(
      <Collapse title="Título" defaultOpen={true}>
        Conteúdo
      </Collapse>,
    );
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("alterna a visibilidade ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<Collapse title="Título">Conteúdo</Collapse>);

    // Abre o collapse
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();

    // Fecha o collapse
    await user.click(screen.getByRole("button"));
    expect(screen.queryByText("Conteúdo")).not.toBeInTheDocument();
  });

  it("chama onToggle quando o estado muda", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <Collapse title="Título" onToggle={onToggle}>
        Conteúdo
      </Collapse>,
    );

    await user.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledWith(true);

    await user.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("exibe ícone de seta para cima quando aberto", async () => {
    const user = userEvent.setup();
    render(<Collapse title="Título">Conteúdo</Collapse>);

    await user.click(screen.getByRole("button"));
    expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
  });

  it("exibe ícone de seta para baixo quando fechado", () => {
    render(<Collapse title="Título">Conteúdo</Collapse>);
    expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
  });
});
