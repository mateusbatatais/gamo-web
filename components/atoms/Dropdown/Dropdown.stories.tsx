import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dropdown, DropdownProps, DropdownOption } from "./Dropdown";

const options: DropdownOption[] = [
  { value: "opt1", label: "Option 1" },
  { value: "opt2", label: "Option 2" },
  { value: "opt3", label: "Option 3" },
];

const meta: Meta<DropdownProps> = {
  title: "Components/Atoms/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  args: {
    options,
    selected: "",
    placeholder: "Selecione...",
  },
  argTypes: {
    options: { control: false },
    selected: {
      control: { type: "select" },
      options: ["", "opt1", "opt2", "opt3"],
      description: "Valor da opção selecionada",
    },
    placeholder: { control: "text", description: "Texto placeholder" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<DropdownProps>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: {
    selected: "opt2",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    selected: "",
    placeholder: "Escolha uma opção",
  },
};
