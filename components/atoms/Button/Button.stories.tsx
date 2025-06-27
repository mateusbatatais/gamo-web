import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, ButtonProps } from "./Button";
import { Home, AlertTriangle, CheckCircle } from "lucide-react";

const meta: Meta<ButtonProps> = {
  title: "Components/Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl"],
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "transparent"],
    },
    status: {
      control: { type: "select" },
      options: ["default", "success", "danger", "warning", "info"],
    },
    iconPosition: {
      control: { type: "select" },
      options: ["left", "right"],
      description: "Position of the icon relative to the label",
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

export const Secondary: Story = {
  args: {
    label: "Botão Secundário",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    label: "Botão Outline",
    variant: "outline",
  },
};

export const OutlineSuccess: Story = {
  args: {
    label: "Outline Success",
    variant: "outline",
    status: "success",
  },
};

export const OutlineDanger: Story = {
  args: {
    label: "Outline Danger",
    variant: "outline",
    status: "danger",
  },
};

export const Transparent: Story = {
  args: {
    label: "Botão Transparente",
    variant: "transparent",
  },
};

export const TransparentWarning: Story = {
  args: {
    label: "Transparent Warning",
    variant: "transparent",
    status: "warning",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Com Ícone",
    variant: "primary",
    icon: <Home className="w-4 h-4" />,
    iconPosition: "left",
  },
};

export const DangerSolid: Story = {
  args: {
    label: "Perigo",
    variant: "primary",
    status: "danger",
    icon: <AlertTriangle className="w-4 h-4" />,
    iconPosition: "left",
  },
};

export const DangerOutline: Story = {
  args: {
    label: "Perigo Outline",
    variant: "outline",
    status: "danger",
    icon: <AlertTriangle className="w-4 h-4" />,
    iconPosition: "left",
  },
};

export const SuccessSolid: Story = {
  args: {
    label: "Sucesso",
    variant: "primary",
    status: "success",
    icon: <CheckCircle className="w-4 h-4" />,
    iconPosition: "right",
  },
};

export const SuccessOutline: Story = {
  args: {
    label: "Sucesso Outline",
    variant: "outline",
    status: "success",
    icon: <CheckCircle className="w-4 h-4" />,
    iconPosition: "right",
  },
};

export const Disabled: Story = {
  args: {
    label: "Desabilitado",
    disabled: true,
  },
};

export const DisabledOutline: Story = {
  args: {
    label: "Outline Desabilitado",
    variant: "outline",
    disabled: true,
  },
};

export const UsingChildren: Story = {
  args: {
    children: (
      <span className="flex items-center">
        <Home className="mr-2 w-4 h-4" />
        <span>
          Usando <em>children</em>
        </span>
      </span>
    ),
    variant: "outline",
    status: "info",
  },
};

export const ExtraLarge: Story = {
  args: {
    label: "Botão Extra Large",
    size: "xl",
    variant: "primary",
  },
};
