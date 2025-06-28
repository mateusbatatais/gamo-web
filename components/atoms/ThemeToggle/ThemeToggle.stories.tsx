import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeToggle } from "./ThemeToggle";
import { within, userEvent, expect } from "storybook/test";

const meta: Meta<typeof ThemeToggle> = {
  title: "Components/Atoms/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["icon", "text", "full"],
    },
    showSystemOption: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const DefaultIcon: Story = {
  args: {
    size: "md",
    variant: "icon",
  },
};

export const WithText: Story = {
  args: {
    variant: "text",
  },
};

export const FullWithSystem: Story = {
  args: {
    variant: "full",
    showSystemOption: true,
  },
};

export const InteractiveToggle: Story = {
  args: {
    variant: "full",
    showSystemOption: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verifica tema inicial
    const themeButton = canvas.getAllByRole("button")[1];
    await expect(themeButton).toHaveAccessibleName("Ativar modo escuro");

    // Alterna tema
    await userEvent.click(themeButton);
    await expect(themeButton).toHaveAccessibleName("Ativar modo claro");

    // Seleciona tema do sistema
    const systemButton = canvas.getAllByRole("button")[0];
    await userEvent.click(systemButton);

    // Verifica se o tema do sistema está ativo
    await expect(systemButton).toHaveClass("bg-gray-200");
  },
};

export const SizeGallery = () => (
  <div className="flex items-center gap-4 p-4">
    <ThemeToggle size="sm" />
    <ThemeToggle size="md" />
    <ThemeToggle size="lg" />
  </div>
);

export const VariantGallery = () => (
  <div className="flex flex-col gap-4 p-4">
    <div className="flex items-center gap-4">
      <ThemeToggle variant="icon" />
      <span>Icon Only</span>
    </div>
    <div className="flex items-center gap-4">
      <ThemeToggle variant="text" />
      <span>With Text</span>
    </div>
    <div className="flex items-center gap-4">
      <ThemeToggle variant="full" showSystemOption />
      <span>Full with System Option</span>
    </div>
  </div>
);
