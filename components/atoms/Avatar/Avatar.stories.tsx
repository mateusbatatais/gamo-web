import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";
import { User, UserX } from "lucide-react";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    src: {
      control: { type: "text" },
    },
    alt: {
      control: { type: "text" },
    },
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    alt: "Usuário",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "João Silva",
    size: "md",
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Avatar alt="Extra Small" size="xs" className="border-2" />
      <Avatar alt="Small" size="sm" className="border-2" />
      <Avatar alt="Medium" size="md" className="border-2" />
      <Avatar alt="Large" size="lg" className="border-2" />
      <Avatar alt="Extra Large" size="xl" className="border-2" />
    </div>
  ),
};

export const WithDifferentNames: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Avatar alt="João Silva" size="md" />
      <Avatar alt="Maria" size="md" />
      <Avatar alt="Pedro Antônio Santos" size="md" />
      <Avatar alt="Ana" size="md" />
      <Avatar alt="Carlos Eduardo Pereira" size="md" />
    </div>
  ),
};

export const WithCustomFallback: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Avatar alt="Usuário" size="md" fallback={<User className="text-gray-400" size={24} />} />
      <Avatar
        alt="Usuário Desconhecido"
        size="lg"
        fallback={<UserX className="text-gray-400" size={32} />}
      />
      <Avatar
        alt="Time"
        size="md"
        fallback={
          <div className="bg-blue-100 text-blue-600 rounded-full w-full h-full flex items-center justify-center text-sm font-bold">
            TEAM
          </div>
        }
      />
    </div>
  ),
};

export const WithInvalidImage: Story = {
  args: {
    src: "invalid-url",
    alt: "Usuário com imagem inválida",
    size: "md",
  },
};

export const WithLongName: Story = {
  args: {
    alt: "João Carlos Eduardo Silva Santos Pereira",
    size: "lg",
  },
};

export const EmptyAlt: Story = {
  args: {
    alt: "",
    size: "md",
  },
};

export const WithSpecialCharacters: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Avatar alt="João Silva" size="md" />
      <Avatar alt="Maria São João" size="md" />
      <Avatar alt="Carlos D'avilla" size="md" />
      <Avatar alt="Ana Müller" size="md" />
    </div>
  ),
};
