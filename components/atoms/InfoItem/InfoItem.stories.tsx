import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import InfoItem from "./InfoItem";

const meta: Meta<typeof InfoItem> = {
  title: "Components/Atoms/InfoItem",
  component: InfoItem,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Texto do label",
    },
    value: {
      control: "text",
      description: "Valor a ser exibido (pode ser string, número ou ReactNode)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfoItem>;

export const Default: Story = {
  args: {
    label: "Nome",
    value: "João Silva",
  },
};

export const EmptyValue: Story = {
  args: {
    label: "Email",
    value: null,
  },
  name: "Valor vazio (exibe '-')",
};

export const CustomValue: Story = {
  args: {
    label: "Status",
    value: <span className="text-green-500">Ativo</span>,
  },
  name: "Valor personalizado (ReactNode)",
};

export const InDarkMode: Story = {
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
  args: {
    label: "Dark Mode",
    value: "Funcionando",
  },
  name: "Em modo escuro",
};

export const MultipleItems: Story = {
  render: () => (
    <div className="space-y-4">
      <InfoItem label="Nome" value="Maria Souza" />
      <InfoItem label="Idade" value={28} />
      <InfoItem label="Email" value="maria@exemplo.com" />
      <InfoItem label="Status" value={<span className="text-green-500">Ativo</span>} />
      <InfoItem label="Telefone" value={null} />
    </div>
  ),
  name: "Vários itens juntos",
};
