import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./Textarea";
import { Info, CheckCircle } from "lucide-react";

const meta: Meta<typeof Textarea> = {
  title: "Atoms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    status: {
      control: { type: "select" },
      options: ["default", "success", "danger", "warning", "info"],
    },
    iconPosition: {
      control: { type: "select" },
      options: ["left", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: "Descrição",
    placeholder: "Digite sua descrição...",
  },
};

export const WithError: Story = {
  args: {
    label: "Com erro",
    error: "Campo obrigatório",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Com ícone",
    icon: <Info className="w-5 h-5" />,
  },
};

export const SuccessStatus: Story = {
  args: {
    label: "Status success",
    status: "success",
    icon: <CheckCircle className="w-5 h-5 text-success-500" />,
  },
};

export const Disabled: Story = {
  args: {
    label: "Desabilitado",
    disabled: true,
    value: "Texto desabilitado",
  },
};

export const SizeGallery: Story = {
  render: () => (
    <div className="space-y-4">
      <Textarea size="sm" label="Pequeno" placeholder="Tamanho sm" />
      <Textarea size="md" label="Médio" placeholder="Tamanho md" />
      <Textarea size="lg" label="Grande" placeholder="Tamanho lg" />
    </div>
  ),
};
