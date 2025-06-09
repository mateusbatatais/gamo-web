import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Dropdown, DropdownOption } from "./Dropdown";

describe("Dropdown component", () => {
  const options: DropdownOption[] = [
    { value: "opt1", label: "Option 1" },
    { value: "opt2", label: "Option 2" },
    { value: "opt3", label: "Option 3" },
  ];

  it("renderiza placeholder quando nenhuma opção é selecionada", () => {
    render(
      <Dropdown options={options} selected="" onChange={vi.fn()} placeholder="Selecione..." />,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Selecione...");
  });

  it("renderiza label da opção selecionada", () => {
    render(<Dropdown options={options} selected="opt2" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveTextContent("Option 2");
  });

  it("abre e fecha o menu ao clicar no botão", async () => {
    render(<Dropdown options={options} selected="" onChange={vi.fn()} />);
    const toggleBtn = screen.getByRole("button");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    await userEvent.click(toggleBtn);
    expect(screen.getByRole("list")).toBeInTheDocument();

    await userEvent.click(toggleBtn);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("fecha o menu ao clicar fora", async () => {
    render(<Dropdown options={options} selected="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("list")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("chama onChange e fecha ao selecionar uma opção", async () => {
    const onChange = vi.fn();
    render(<Dropdown options={options} selected="" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    const list = screen.getByRole("list");
    const optionBtn = within(list).getByRole("button", { name: "Option 3" });
    await userEvent.click(optionBtn);
    expect(onChange).toHaveBeenCalledWith("opt3");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("destaca a opção selecionada com estilo correto", async () => {
    render(<Dropdown options={options} selected="opt1" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole("button"));
    const list = screen.getByRole("list");
    const selectedOption = within(list).getByRole("button", { name: "Option 1" });
    expect(selectedOption).toHaveClass("bg-primary-100");
  });
});
