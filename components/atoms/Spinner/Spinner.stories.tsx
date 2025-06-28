import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Atoms/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "loader",
        "rotate",
        "refresh",
        "dashed",
        "primary",
        "success",
        "danger",
        "warning",
        "info",
      ],
    },
    size: {
      control: { type: "number" },
    },
    strokeWidth: {
      control: { type: "number" },
    },
  },
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1a1a1a" },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

// Histórias existentes...

export const ThinStroke: Story = {
  args: {
    strokeWidth: 1,
  },
};

export const ThickStroke: Story = {
  args: {
    strokeWidth: 3,
  },
};

export const CustomSize: Story = {
  args: {
    size: 40,
  },
};
