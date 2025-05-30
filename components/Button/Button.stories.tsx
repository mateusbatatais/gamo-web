import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, ButtonProps } from "./Button";
import { Home, AlertTriangle, CheckCircle } from "lucide-react";

const meta: Meta<ButtonProps> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "transparent"],
    },
    status: {
      control: { type: "select" },
      options: ["default", "success", "danger", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: {
    label: "Botão Primário",
    variant: "primary",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Com Ícone",
    variant: "primary",
    icon: <Home className="w-4 h-4 mr-2" />,
  },
};

export const Danger: Story = {
  args: {
    label: "Perigo",
    status: "danger",
    icon: <AlertTriangle className="w-4 h-4 mr-2" />,
  },
};

export const Success: Story = {
  args: {
    label: "Sucesso",
    status: "success",
    icon: <CheckCircle className="w-4 h-4 mr-2" />,
  },
};

export const Disabled: Story = {
  args: {
    label: "Desabilitado",
    disabled: true,
  },
};
