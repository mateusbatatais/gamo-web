// components/atoms/Tabs/Tabs.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tabs, TabItem } from "./Tabs";

describe("Tabs component", () => {
  it("renderiza corretamente com abas", () => {
    render(
      <Tabs>
        <TabItem label="Aba 1">Conteúdo 1</TabItem>
        <TabItem label="Aba 2">Conteúdo 2</TabItem>
      </Tabs>,
    );

    expect(screen.getByText("Aba 1")).toBeInTheDocument();
    expect(screen.getByText("Aba 2")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo 1")).toBeInTheDocument();
  });

  it("muda de aba ao clicar", () => {
    render(
      <Tabs>
        <TabItem label="Aba 1">Conteúdo 1</TabItem>
        <TabItem label="Aba 2">Conteúdo 2</TabItem>
      </Tabs>,
    );

    fireEvent.click(screen.getByText("Aba 2"));
    expect(screen.getByText("Conteúdo 2")).toBeInTheDocument();
  });

  it("chama onChange ao mudar de aba", () => {
    const onChange = vi.fn();
    render(
      <Tabs onChange={onChange}>
        <TabItem label="Aba 1">Conteúdo 1</TabItem>
        <TabItem label="Aba 2">Conteúdo 2</TabItem>
      </Tabs>,
    );

    fireEvent.click(screen.getByText("Aba 2"));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("respeita defaultValue", () => {
    render(
      <Tabs defaultValue={1}>
        <TabItem label="Aba 1">Conteúdo 1</TabItem>
        <TabItem label="Aba 2">Conteúdo 2</TabItem>
      </Tabs>,
    );

    expect(screen.getByText("Conteúdo 2")).toBeInTheDocument();
  });

  it("desabilita abas quando disabled", () => {
    render(
      <Tabs>
        <TabItem label="Aba 1">Conteúdo 1</TabItem>
        <TabItem label="Aba 2" disabled>
          Conteúdo 2
        </TabItem>
      </Tabs>,
    );

    // Verifica se a segunda aba está desabilitada
    const tab2Button = screen.getByText("Aba 2").closest("button");
    expect(tab2Button).toBeDisabled();
    expect(tab2Button).toHaveClass("cursor-not-allowed");
  });
});
