import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Collapse } from "./Collapse";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";
import { Card } from "../Card/Card";

const meta: Meta<typeof Collapse> = {
  title: "Components/Atoms/Collapse",
  component: Collapse,
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
    title: { control: "text" },
    onToggle: { action: "toggled" },
  },
  args: {
    title: "Clique para expandir",
    defaultOpen: false,
  },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-2">
        <p>Conteúdo do Collapse. Pode ser qualquer coisa, como texto, componentes, etc.</p>
        <Badge status="success">Sucesso!</Badge>
      </div>
    ),
  },
};

export const InitiallyOpen: Story = {
  args: {
    defaultOpen: true,
    children: (
      <div>
        <p>Este Collapse começa aberto por padrão.</p>
        <Button label="Botão dentro do Collapse" />
      </div>
    ),
  },
};

export const WithComplexContent: Story = {
  args: {
    title: "Collapse com conteúdo complexo",
    children: (
      <Card>
        <h3 className="font-bold mb-2">Card dentro do Collapse</h3>
        <p className="mb-4">
          Isso mostra que você pode colocar qualquer conteúdo dentro do Collapse.
        </p>
        <div className="flex gap-2">
          <Button label="Ação 1" />
          <Button variant="outline" status="danger" label="Ação 2" />
        </div>
      </Card>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    title: "Collapse com conteúdo longo",
    children: (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus
            hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut
            eleifend nibh porttitor.
          </p>
        ))}
      </div>
    ),
  },
};
