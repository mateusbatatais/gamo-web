import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea, TextareaProps } from "./Textarea";

const meta: Meta<TextareaProps> = {
  title: "Components/Atoms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 1 } },
    inputSize: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
    error: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<TextareaProps>;

export const Default: Story = {
  args: {
    label: "Descrição",
    placeholder: "Escreva algo...",
    rows: 4,
    inputSize: "md",
  },
};

export const WithError: Story = {
  args: {
    label: "Comentário",
    placeholder: "Digite seu comentário",
    error: "Campo obrigatório",
    rows: 3,
    inputSize: "md",
  },
};

export const Large: Story = {
  args: {
    label: "Observações",
    placeholder: "Mais espaço…",
    rows: 6,
    inputSize: "lg",
  },
};

export const Small: Story = {
  args: {
    label: "Nota Rápida",
    placeholder: "Até 2 linhas…",
    rows: 2,
    inputSize: "sm",
  },
};
