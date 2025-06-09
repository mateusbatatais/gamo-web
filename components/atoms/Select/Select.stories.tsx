import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select, SelectProps } from "./Select";

const meta: Meta<SelectProps> = {
  title: "Components/Atoms/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    options: { control: false },
  },
};

export default meta;
type Story = StoryObj<SelectProps>;

const sampleOptions = [
  { value: "ps5", label: "PlayStation 5" },
  { value: "xbox", label: "Xbox Series X" },
];

export const Default: Story = {
  args: {
    label: "Console",
    options: sampleOptions,
  },
};

export const WithError: Story = {
  args: {
    label: "Console",
    options: sampleOptions,
    error: "Seleção obrigatória",
  },
};
