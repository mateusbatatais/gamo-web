import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from "./EmptyState";
import { Search, AlertTriangle } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "Components/Atoms/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["default", "simple", "card"],
    },
    actionVariant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "transparent"],
    },
    actionStatus: {
      control: { type: "select" },
      options: ["default", "success", "danger", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "Nenhum item encontrado",
    description:
      "Parece que você ainda não tem itens nesta lista. Comece adicionando um novo item.",
  },
};

export const WithAction: Story = {
  args: {
    title: "Nenhum item encontrado",
    description: "Parece que você ainda não tem itens nesta lista.",
    actionText: "Adicionar item",
    onAction: () => alert("Ação!"),
  },
};

export const WithCustomIcon: Story = {
  args: {
    title: "Nenhum resultado",
    description: "Sua busca não retornou nenhum resultado. Tente outros termos.",
    icon: <Search className="text-gray-400 dark:text-gray-500 w-12 h-12" />,
  },
};

export const SmallSize: Story = {
  args: {
    title: "Lista vazia",
    description: "Adicione itens para começar",
    size: "sm",
  },
};

export const CardVariant: Story = {
  args: {
    title: "Nenhum item",
    description: "Esta seção está vazia no momento",
    variant: "card",
  },
};

export const DangerState: Story = {
  args: {
    title: "Erro ao carregar",
    description: "Ocorreu um erro ao tentar carregar os itens. Tente novamente.",
    actionText: "Tentar novamente",
    onAction: () => alert("Tentando novamente..."),
    actionVariant: "primary",
    actionStatus: "danger",
    icon: <AlertTriangle className="text-danger-500 w-12 h-12" />,
  },
};

export const WithComplexDescription: Story = {
  args: {
    title: "Configuração necessária",
    description: (
      <div className="flex flex-col gap-2">
        <p>Você precisa configurar sua conta antes de continuar</p>
        <ul className="text-left list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
          <li>Verifique seu e-mail</li>
          <li>Complete seu perfil</li>
          <li>Configure suas preferências</li>
        </ul>
      </div>
    ),
    actionText: "Configurar conta",
    variant: "card",
  },
};

export const InDarkMode: Story = {
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
  args: {
    title: "Modo Escuro Ativo",
    description: "Este é o empty state no modo escuro",
    variant: "simple",
    actionText: "Ação",
  },
};
