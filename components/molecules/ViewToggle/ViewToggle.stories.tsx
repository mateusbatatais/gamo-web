// components/molecules/ViewToggle/ViewToggle.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ViewToggle } from "./ViewToggle";

const meta: Meta<typeof ViewToggle> = {
  title: "Components/Molecules/ViewToggle",
  component: ViewToggle,
  tags: ["autodocs"],
  argTypes: {
    onViewChange: { action: "viewChanged" },
    defaultView: {
      control: "radio",
      options: ["grid", "list"],
      description: "Visualização padrão ao carregar o componente",
    },
    storageKey: {
      control: "text",
      description: "Chave para armazenar a preferência no localStorage",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ViewToggle>;

export const Default: Story = {
  args: {
    defaultView: "grid",
  },
};

export const ListAsDefault: Story = {
  args: {
    defaultView: "list",
  },
};

export const WithCustomStorageKey: Story = {
  args: {
    storageKey: "custom-view-key",
  },
};

export const WithCallback: Story = {
  args: {
    onViewChange: (view) => console.log("View changed to:", view),
  },
};
