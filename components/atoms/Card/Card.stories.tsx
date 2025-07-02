// components/atoms/Card/Card.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../Button/Button";
import { Card } from "./Card";
import Link from "next/link";

const meta: Meta<typeof Card> = {
  title: "Components/Atoms/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Classes CSS adicionais para estilização personalizada",
    },
    children: {
      control: "text",
      description: "Conteúdo do card",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Template reutilizável
const Template: Story = {
  render: (args) => <Card {...args} />,
};

export const Default: Story = {
  ...Template,
  args: {
    children: "Conteúdo básico do card",
  },
};

export const WithComplexContent: Story = {
  render: (args) => (
    <Card {...args}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Título do Card</h2>
        <p>Este é um exemplo de card com conteúdo mais complexo, incluindo um botão.</p>
        <div className="flex justify-end">
          <Button label="Ação" variant="primary" size="sm" />
        </div>
      </div>
    </Card>
  ),
};

export const WithCustomClass: Story = {
  ...Template,
  args: {
    children: "Card com classe personalizada",
    className: "bg-primary-100 border-primary-500 text-primary-800",
  },
};

export const DarkMode: Story = {
  parameters: {
    themes: {
      default: "dark",
    },
  },
  ...Template,
  args: {
    children: "Card em modo escuro",
  },
};

export const AsLinkCard: Story = {
  render: () => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <Link href="#" className="block">
        <h3 className="text-lg font-semibold mb-2">Card como link</h3>
        <p>Clique para navegar</p>
      </Link>
    </Card>
  ),
};

export const StatCard: Story = {
  render: () => (
    <Card className="text-center p-4">
      <p className="text-gray-500">Total de Vendas</p>
      <p className="text-3xl font-bold">24</p>
      <p className="text-sm text-success-500 mt-1">+12% desde o último mês</p>
    </Card>
  ),
};

export const CardWithHeader: Story = {
  render: () => (
    <Card>
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold">Card com Cabeçalho</h2>
      </div>
      <p>Conteúdo principal do card aqui...</p>
    </Card>
  ),
};
