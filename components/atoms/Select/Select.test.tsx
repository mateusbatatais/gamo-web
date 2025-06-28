import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Select } from "./Select";
import { Home } from "lucide-react";

const options = [
  { value: "1", label: "Opção 1" },
  { value: "2", label: "Opção 2" },
];

describe("Select component", () => {
  it("renderiza com label", () => {
    render(<Select label="Teste" options={options} />);
    expect(screen.getByText("Teste")).toBeInTheDocument();
  });

  it("exibe opções corretamente", () => {
    render(<Select options={options} />);
    expect(screen.getByText("Opção 1")).toBeInTheDocument();
    expect(screen.getByText("Opção 2")).toBeInTheDocument();
  });

  it("exibe mensagem de erro", () => {
    render(<Select options={options} error="Erro teste" />);
    expect(screen.getByText("Erro teste")).toBeInTheDocument();
    expect(screen.getByRole("combobox").className).toContain("border-danger");
  });

  it("desabilitado fica com aparência correta", () => {
    render(<Select options={options} disabled />);
    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
    expect(select.className).toContain("opacity-70");
    expect(select.className).toContain("cursor-not-allowed");
  });

  it("tamanho sm aplica classes corretas", () => {
    render(<Select options={options} size="sm" />);
    const select = screen.getByRole("combobox");
    expect(select.className).toContain("py-1.5");
    expect(select.className).toContain("px-2.5");
    expect(select.className).toContain("text-sm");
  });

  it("status success aplica classes corretas", () => {
    render(<Select options={options} status="success" />);
    const select = screen.getByRole("combobox");
    expect(select.className).toContain("border-success");
  });

  it("ícone à esquerda aplica padding correto", () => {
    render(<Select options={options} icon={<Home />} iconPosition="left" />);
    const select = screen.getByRole("combobox");
    expect(select.className).toContain("pl-10");
  });

  it("ícone à direita aplica padding correto", () => {
    render(<Select options={options} icon={<Home />} iconPosition="right" />);
    const select = screen.getByRole("combobox");
    expect(select.className).toContain("pr-10");
  });

  it("modo dark aplica classes corretas", () => {
    render(<Select options={options} />);
    const select = screen.getByRole("combobox");
    expect(select.className).toContain("dark:bg-neutral-800");
    expect(select.className).toContain("dark:text-white");
  });
});
