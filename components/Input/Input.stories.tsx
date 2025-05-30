// components/Input/Input.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";
import { Mail } from "lucide-react";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "Digite seu email",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Email",
    placeholder: "Digite seu email",
    icon: <Mail className="text-gray-400" />,
  },
};

export const Error: Story = {
  args: {
    label: "Email",
    placeholder: "Digite seu email",
    error: "Campo obrigatório",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input label="Pequeno" placeholder="sm" inputSize="sm" />
      <Input label="Médio" placeholder="md" inputSize="md" />
      <Input label="Grande" placeholder="lg" inputSize="lg" />
    </div>
  ),
};
