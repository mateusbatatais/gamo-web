// components/Input/Input.stories.tsx
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mail } from "lucide-react";
import { Input, InputProps } from "./Input";

const meta: Meta<InputProps> = {
  title: "Components/Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    showToggle: { control: "boolean" },
    inputSize: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
    error: { control: "text" },
    icon: { control: false }, // não controlamos o ícone via args
  },
};

export default meta;
type Story = StoryObj<InputProps>;

// 1) Input padrão
export const Default: Story = {
  args: {
    label: "Nome",
    placeholder: "Digite seu nome",
    inputSize: "md",
  },
};

// 2) Input com ícone à esquerda
export const WithIcon: Story = {
  args: {
    label: "Email",
    placeholder: "seu@exemplo.com",
    icon: <Mail size={18} className="text-gray-400" />,
    inputSize: "md",
  },
};

// 3) Input de senha com mostrar/ocultar (showToggle)
export const PasswordToggle: Story = {
  args: {
    label: "Senha",
    placeholder: "••••••••",
    type: "password",
    showToggle: true,
    inputSize: "md",
  },
};

// 4) Input com mensagem de erro
export const WithError: Story = {
  args: {
    label: "Username",
    placeholder: "usuario123",
    error: "Este campo é obrigatório",
    inputSize: "md",
  },
};

// 5) Input em tamanho grande (lg)
export const LargeSize: Story = {
  args: {
    label: "Cidade",
    placeholder: "Digite sua cidade",
    inputSize: "lg",
  },
};

// 6) Input em tamanho pequeno (sm)
export const SmallSize: Story = {
  args: {
    label: "Telefone",
    placeholder: "(99) 99999-9999",
    inputSize: "sm",
  },
};
