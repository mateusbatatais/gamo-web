// stories/Toast.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Toast from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "UI/Toast",
  component: Toast,
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
    message: { control: "text" },
    durationMs: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    type: "success",
    message: "Operação realizada com sucesso!",
    durationMs: 0, // sem auto-fechar
  },
};

export const Danger: Story = {
  args: {
    type: "danger",
    message: "Ocorreu um erro ao salvar.",
    durationMs: 0,
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    message: "Atenção! Verifique os campos.",
    durationMs: 0,
  },
};

export const Info: Story = {
  args: {
    type: "info",
    message: "Informação disponível.",
    durationMs: 0,
  },
};

export const Primary: Story = {
  args: {
    type: "primary",
    message: "Este é um toast primário.",
    durationMs: 0,
  },
};

export const Secondary: Story = {
  args: {
    type: "secondary",
    message: "Este é um toast secundário.",
    durationMs: 0,
  },
};

export const Accent: Story = {
  args: {
    type: "accent",
    message: "Toast de ação destaque.",
    durationMs: 0,
  },
};

export const Neutral: Story = {
  args: {
    type: "neutral",
    message: "Toast neutro para notificações gerais.",
    durationMs: 0,
  },
};
