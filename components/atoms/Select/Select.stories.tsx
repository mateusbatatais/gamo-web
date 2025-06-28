import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";
import { Home, CheckCircle } from "lucide-react";

const meta: Meta<typeof Select> = {
  title: "Components/Atoms/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl"],
    },
    status: {
      control: { type: "select" },
      options: ["default", "success", "danger", "warning", "info"],
    },
    iconPosition: {
      control: { type: "select" },
      options: ["left", "right"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    options: [
      { value: "1", label: "Opção 1" },
      { value: "2", label: "Opção 2" },
      { value: "3", label: "Opção 3" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: "Selecione uma opção",
  },
};

export const WithError: Story = {
  args: {
    label: "Select com erro",
    error: "Campo obrigatório",
  },
};

export const Disabled: Story = {
  args: {
    label: "Select desabilitado",
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    label: "Select pequeno",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    label: "Select grande",
    size: "lg",
  },
};

export const SuccessStatus: Story = {
  args: {
    label: "Status success",
    status: "success",
  },
};

export const WarningStatus: Story = {
  args: {
    label: "Status warning",
    status: "warning",
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: "Com ícone à esquerda",
    icon: <Home className="w-4 h-4" />,
    iconPosition: "left",
  },
};

export const WithRightIcon: Story = {
  args: {
    label: "Com ícone à direita",
    icon: <CheckCircle className="w-4 h-4 text-success-500" />,
    iconPosition: "right",
    status: "success",
  },
};

export const StatusGallery = () => (
  <div className="grid grid-cols-1 gap-4">
    {(["default", "success", "danger", "warning", "info"] as const).map((status) => (
      <Select
        key={status}
        label={`Status ${status}`}
        options={meta.args!.options ?? []}
        status={status}
      />
    ))}
  </div>
);

export const SizeGallery = () => (
  <div className="grid grid-cols-1 gap-4">
    {(["sm", "md", "lg", "xl"] as const).map((size) => (
      <Select key={size} label={`Tamanho ${size}`} options={meta.args!.options ?? []} size={size} />
    ))}
  </div>
);

export const InDarkMode: Story = {
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
  args: {
    label: "Modo dark",
  },
};
