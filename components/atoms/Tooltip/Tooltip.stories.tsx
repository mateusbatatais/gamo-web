import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";
import { Info } from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "light", "dark"],
    },
    placement: {
      control: { type: "select" },
      options: ["top", "bottom", "left", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    title: "Informação adicional sobre este elemento",
    children: <Button>Passe o mouse</Button>,
  },
};

export const LightVariant: Story = {
  args: {
    ...Default.args,
    variant: "light",
    title: "Tooltip com fundo claro",
  },
};

export const WithoutArrow: Story = {
  args: {
    ...Default.args,
    arrow: false,
    title: "Tooltip sem seta",
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
    children: (
      <div className="flex items-center gap-1 text-neutral-500 hover:text-neutral-700 cursor-pointer">
        <Info size={16} />
        <span>Informações</span>
      </div>
    ),
  },
};

export const BottomPlacement: Story = {
  args: {
    ...Default.args,
    placement: "bottom",
    title: "Tooltip na parte inferior",
  },
};

export const LongContent: Story = {
  args: {
    ...Default.args,
    title: "Este é um tooltip com conteúdo mais longo que pode ocupar várias linhas se necessário",
  },
};
