import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Radio } from "./Radio";
import React from "react";

const meta: Meta<typeof Radio> = {
  title: "Components/Atoms/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    error: {
      control: "boolean",
      description: "Exibe estado de erro",
    },
    disabled: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    description: {
      control: "text",
    },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: "Radio option",
  },
};

export const Selected: Story = {
  args: {
    label: "Radio selecionado",
    checked: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Radio com descrição",
    description: "Esta é uma descrição detalhada",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Radio com erro",
    error: true,
  },
};

export const ErrorStateSelected: Story = {
  args: {
    label: "Radio com erro selecionado",
    error: true,
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Radio desabilitado",
    disabled: true,
  },
};

export const SelectedDisabled: Story = {
  args: {
    label: "Radio selecionado e desabilitado",
    checked: true,
    disabled: true,
  },
};

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = React.useState("option1");
    return (
      <div className="flex flex-col gap-4">
        <Radio
          label="Opção 1"
          checked={selected === "option1"}
          onChange={() => setSelected("option1")}
        />
        <Radio
          label="Opção 2"
          checked={selected === "option2"}
          onChange={() => setSelected("option2")}
        />
        <Radio
          label="Opção 3"
          checked={selected === "option3"}
          onChange={() => setSelected("option3")}
          disabled
        />
        <div className="mt-4">
          <p>Selecionado: {selected}</p>
        </div>
      </div>
    );
  },
};

export const GroupWithError: Story = {
  render: () => {
    const [selected, setSelected] = React.useState("");
    return (
      <div className="flex flex-col gap-4">
        <Radio
          label="Opção A"
          checked={selected === "A"}
          onChange={() => setSelected("A")}
          error={!selected}
        />
        <Radio
          label="Opção B"
          checked={selected === "B"}
          onChange={() => setSelected("B")}
          error={!selected}
        />
        <div className="mt-2 text-sm text-danger">{!selected && "Selecione uma opção"}</div>
      </div>
    );
  },
};

export const DarkMode: Story = {
  args: {
    label: "Radio modo escuro",
    checked: true,
  },
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
};

export const CustomSize: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Radio label="Pequeno" className="!w-4 !h-4" containerClassName="items-baseline" />
      <Radio label="Médio (padrão)" checked />
      <Radio label="Grande" className="!w-6 !h-6" containerClassName="items-baseline" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: {
    "aria-label": "Radio sem label visível",
  },
};
