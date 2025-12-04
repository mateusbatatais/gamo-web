// components/molecules/Alert/Alert.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Alert from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Molecules/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: {
        type: "select",
        options: [
          "success",
          "danger",
          "warning",
          "info",
          "primary",
          "secondary",
          "accent",
          "neutral",
        ],
      },
    },
    position: {
      control: {
        type: "select",
        options: [
          "top-left",
          "top-center",
          "top-right",
          "bottom-left",
          "bottom-center",
          "bottom-right",
        ],
      },
    },
    message: { control: "text" },
    durationMs: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    type: "info",
    message: "This is a default alert message.",
    position: "top-right",
  },
};

export const SuccessTopCenter: Story = {
  args: {
    type: "success",
    message: "Operation successful!",
    position: "top-center",
  },
};

export const DangerBottomRight: Story = {
  args: {
    type: "danger",
    message: "An error occurred.",
    position: "bottom-right",
  },
};

export const WarningBottomLeft: Story = {
  args: {
    type: "warning",
    message: "Warning: Check your input.",
    position: "bottom-left",
  },
};

export const AutoClose: Story = {
  args: {
    type: "info",
    message: "This alert will close in 3 seconds.",
    durationMs: 3000,
    position: "top-right",
  },
};
