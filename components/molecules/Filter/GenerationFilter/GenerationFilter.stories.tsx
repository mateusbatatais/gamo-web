import { Meta, StoryObj } from "@storybook/nextjs-vite";
import GenerationFilter from "./GenerationFilter";

const meta: Meta = {
  title: "Components/GenerationFilter",
  component: GenerationFilter,
  argTypes: {
    onGenerationChange: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<typeof GenerationFilter>;

export const Default: Story = {
  args: {
    selectedGenerations: ["1", "3"], // Gerações selecionadas por padrão
    onGenerationChange: (selectedGenerations) => {
      console.log("Selected generations:", selectedGenerations);
    },
  },
};
