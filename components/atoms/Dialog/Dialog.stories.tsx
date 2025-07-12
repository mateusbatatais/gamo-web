import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dialog } from "./Dialog";
import { useState } from "react";
import { Button } from "../Button/Button";
import { AlertCircle, CheckCircle } from "lucide-react";

const meta: Meta<typeof Dialog> = {
  title: "Atoms/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl"],
    },
    closeButtonVariant: {
      control: { type: "select" },
      options: ["icon", "text"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const DialogWrapper = (args: React.ComponentProps<typeof Dialog>) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button label="Abrir Dialog" onClick={() => setOpen(true)} />
      <Dialog {...args} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export const Basic: Story = {
  args: {
    title: "Título do Diálogo",
    children: "Conteúdo do diálogo aqui. Pode conter qualquer elemento React.",
  },
  render: (args) => <DialogWrapper {...args} />,
};

export const WithSubtitle: Story = {
  args: {
    ...Basic.args,
    subtitle: "Este é um subtítulo explicativo",
  },
  render: (args) => <DialogWrapper {...args} />,
};

export const WithIcon: Story = {
  args: {
    ...Basic.args,
    icon: <AlertCircle />,
    title: "Atenção",
    subtitle: "Esta ação requer atenção especial",
  },
  render: (args) => <DialogWrapper {...args} />,
};

export const TextCloseButton: Story = {
  args: {
    ...Basic.args,
    closeButtonVariant: "text",
  },
  render: (args) => <DialogWrapper {...args} />,
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
  render: (args) => <DialogWrapper {...args} />,
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
  render: (args) => <DialogWrapper {...args} />,
};

export const SuccessDialog: Story = {
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
  render: (args) => <DialogWrapper {...args} />,
};

export const SmallDialog: Story = {
  args: {
    ...Basic.args,
    title: "Diálogo Pequeno",
    size: "sm",
  },
  render: (args) => <DialogWrapper {...args} />,
};

export const LargeDialog: Story = {
  args: {
    ...Basic.args,
    title: "Diálogo Grande",
    size: "lg",
  },
  render: (args) => <DialogWrapper {...args} />,
};

export const WithoutFooter: Story = {
  args: {
    ...Basic.args,
    title: "Sem Rodapé",
    children: "Este diálogo não possui área de ações no rodapé",
  },
  render: (args) => <DialogWrapper {...args} />,
};

export const StyledDialog: Story = {
  args: {
    ...Basic.args,
    title: "Diálogo Estilizado",
    className: "custom-dialog",
    sx: {
      "& .MuiDialog-paper": {
        background: "var(--color-primary-50)",
      },
    },
    children: (
      <div className="p-4">
        <p>Conteúdo com estilos customizados</p>
      </div>
    ),
  },
  render: (args) => <DialogWrapper {...args} />,
};
