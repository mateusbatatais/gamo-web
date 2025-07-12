// components/molecules/Dropdown/Dropdown.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dropdown } from "./Dropdown";
import { Button } from "@/components/atoms/Button/Button";
import { Edit, Trash2, User, Settings, LogOut } from "lucide-react";

const meta: Meta<typeof Dropdown> = {
  title: "Molecules/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "transparent"],
    },
    status: {
      control: { type: "select" },
      options: ["default", "success", "danger", "warning", "info"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const commonItems = [
  { id: "edit", label: "Editar", icon: <Edit size={16} /> },
  { id: "delete", label: "Excluir", icon: <Trash2 size={16} /> },
  { id: "disabled", label: "Desativado", disabled: true },
];

export const Default: Story = {
  args: {
    items: commonItems,
    label: "Menu",
  },
};

export const Primary: Story = {
  args: {
    items: commonItems,
    label: "Primário",
    variant: "primary",
  },
};

export const OutlineDanger: Story = {
  args: {
    items: commonItems,
    label: "Perigo",
    variant: "outline",
    status: "danger",
  },
};

export const SmallSize: Story = {
  args: {
    items: commonItems,
    label: "Pequeno",
    size: "sm",
  },
};

export const CustomTrigger: Story = {
  args: {
    items: [
      { id: "profile", label: "Perfil", icon: <User size={16} /> },
      { id: "settings", label: "Configurações", icon: <Settings size={16} /> },
      { id: "logout", label: "Sair", icon: <LogOut size={16} /> },
    ],
    trigger: (
      <Button variant="transparent" className="!p-2">
        <User size={20} />
      </Button>
    ),
  },
};

export const WithComplexItems: Story = {
  args: {
    items: [
      {
        id: "item1",
        label: (
          <div className="flex flex-col">
            <span className="font-medium">Item com título</span>
            <span className="text-xs text-gray-500">Descrição adicional</span>
          </div>
        ),
        className: "py-3",
      },
      {
        id: "item2",
        label: "Item com ícone",
        icon: <Settings size={16} className="text-primary-500" />,
        className: "py-3",
      },
    ],
    label: "Itens Complexos",
  },
};
