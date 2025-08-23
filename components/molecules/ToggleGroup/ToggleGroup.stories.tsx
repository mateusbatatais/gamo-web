import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToggleGroup, ToggleGroupProps } from "./ToggleGroup";
import { ShoppingCart, Eye, Filter } from "lucide-react";

const meta: Meta<ToggleGroupProps> = {
  title: "Molecules/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  argTypes: {
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
type Story = StoryObj<ToggleGroupProps>;

export const Default: Story = {
  args: {
    items: [
      { value: "selling", label: "Vendendo" },
      { value: "looking", label: "Buscando" },
    ],
    value: "selling",
    onChange: (value) => console.log(value),
  },
};

export const PrimaryVariant: Story = {
  args: {
    items: [
      { value: "selling", label: "Vendendo" },
      { value: "looking", label: "Buscando" },
    ],
    value: "selling",
    variant: "primary",
    onChange: (value) => console.log(value),
  },
};

export const SecondaryVariant: Story = {
  args: {
    items: [
      { value: "selling", label: "Vendendo" },
      { value: "looking", label: "Buscando" },
    ],
    value: "selling",
    variant: "secondary",
    onChange: (value) => console.log(value),
  },
};

export const OutlineVariant: Story = {
  args: {
    items: [
      { value: "selling", label: "Vendendo" },
      { value: "looking", label: "Buscando" },
    ],
    value: "selling",
    variant: "outline",
    onChange: (value) => console.log(value),
  },
};

export const TransparentVariant: Story = {
  args: {
    items: [
      { value: "selling", label: "Vendendo" },
      { value: "looking", label: "Buscando" },
    ],
    value: "selling",
    variant: "transparent",
    onChange: (value) => console.log(value),
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        value: "selling",
        label: "Vendendo",
        icon: <ShoppingCart size={16} />,
        iconPosition: "left",
      },
      { value: "looking", label: "Buscando", icon: <Eye size={16} />, iconPosition: "left" },
    ],
    value: "selling",
    onChange: (value) => console.log(value),
  },
};

export const ThreeItems: Story = {
  args: {
    items: [
      { value: "all", label: "Todos", icon: <Filter size={16} /> },
      { value: "selling", label: "Vendendo", icon: <ShoppingCart size={16} /> },
      { value: "looking", label: "Buscando", icon: <Eye size={16} /> },
    ],
    value: "all",
    onChange: (value) => console.log(value),
  },
};

export const SmallSize: Story = {
  args: {
    items: [
      { value: "selling", label: "Vendendo" },
      { value: "looking", label: "Buscando" },
    ],
    value: "selling",
    size: "sm",
    onChange: (value) => console.log(value),
  },
};

export const LargeSize: Story = {
  args: {
    items: [
      { value: "selling", label: "Vendendo" },
      { value: "looking", label: "Buscando" },
    ],
    value: "selling",
    size: "lg",
    onChange: (value) => console.log(value),
  },
};

export const DangerStatus: Story = {
  args: {
    items: [
      { value: "selling", label: "Vendendo" },
      { value: "looking", label: "Buscando" },
    ],
    value: "selling",
    status: "danger",
    onChange: (value) => console.log(value),
  },
};

export const SuccessStatus: Story = {
  args: {
    items: [
      { value: "selling", label: "Vendendo" },
      { value: "looking", label: "Buscando" },
    ],
    value: "selling",
    status: "success",
    onChange: (value) => console.log(value),
  },
};
