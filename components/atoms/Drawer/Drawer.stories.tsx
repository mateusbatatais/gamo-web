import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Drawer } from "./Drawer";
import { useState } from "react";
import { Button } from "../Button/Button";
import { AlertCircle, CheckCircle } from "lucide-react";

const meta: Meta<typeof Drawer> = {
  title: "Atoms/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    closeButtonVariant: {
      control: { type: "select" },
      options: ["icon", "text"],
    },
    anchor: {
      control: { type: "select" },
      options: ["left", "right", "top", "bottom"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const DrawerWrapper = (args: React.ComponentProps<typeof Drawer>) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button label="Abrir Drawer" onClick={() => setOpen(true)} />
      <Drawer {...args} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export const Basic: Story = {
  args: {
    title: "Título do Drawer",
    children: "Conteúdo do drawer aqui. Pode conter qualquer elemento React.",
  },
  render: (args) => <DrawerWrapper {...args} />,
};

export const WithSubtitle: Story = {
  args: {
    ...Basic.args,
    subtitle: "Este é um subtítulo explicativo",
  },
  render: (args) => <DrawerWrapper {...args} />,
};

export const WithIcon: Story = {
  args: {
    ...Basic.args,
    icon: <AlertCircle />,
    title: "Atenção",
    subtitle: "Esta ação requer atenção especial",
  },
  render: (args) => <DrawerWrapper {...args} />,
};

export const TextCloseButton: Story = {
  args: {
    ...Basic.args,
    closeButtonVariant: "text",
  },
  render: (args) => <DrawerWrapper {...args} />,
};

export const CustomActions: Story = {
  args: {
    ...Basic.args,
    title: "Ações Customizadas",
    actions: (
      <div className="flex gap-2">
        <Button variant="outline" label="Opção 1" />
        <Button variant="outline" label="Opção 2" />
        <Button variant="primary" label="Principal" />
      </div>
    ),
  },
  render: (args) => <DrawerWrapper {...args} />,
};

export const DefaultActions: Story = {
  args: {
    ...Basic.args,
    title: "Ações Padrão",
    actionButtons: {
      cancel: { label: "Descartar" },
      confirm: {
        label: "Salvar Alterações",
        variant: "primary",
      },
    },
  },
  render: (args) => <DrawerWrapper {...args} />,
};

export const SuccessDrawer: Story = {
  args: {
    title: "Operação Bem Sucedida",
    icon: <CheckCircle />,
    children: "Sua ação foi concluída com sucesso!",
    actionButtons: {
      confirm: {
        label: "Continuar",
        variant: "primary",
        status: "success",
      },
    },
  },
  render: (args) => <DrawerWrapper {...args} />,
};

export const LeftAnchor: Story = {
  args: {
    ...Basic.args,
    title: "Drawer à Esquerda",
    anchor: "left",
  },
  render: (args) => <DrawerWrapper {...args} />,
};

export const WithoutFooter: Story = {
  args: {
    ...Basic.args,
    title: "Sem Rodapé",
    children: "Este drawer não possui área de ações no rodapé",
  },
  render: (args) => <DrawerWrapper {...args} />,
};
