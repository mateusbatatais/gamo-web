// components/molecules/SortSelect/SortSelect.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SortSelect, SortOption } from "./SortSelect";

const meta: Meta<typeof SortSelect> = {
  title: "Molecules/SortSelect",
  component: SortSelect,
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
    options: {
      control: "object",
      description: "Opções de ordenação disponíveis",
    },
    value: {
      control: "text",
      description: "Valor atualmente selecionado",
    },
    className: {
      control: "text",
      description: "Classe CSS adicional",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SortSelect>;

const defaultOptions: SortOption[] = [
  { value: "name-asc", label: "Nome (A-Z)" },
  { value: "name-desc", label: "Nome (Z-A)" },
  { value: "releaseDate-asc", label: "Data de Lançamento (Mais antigos)" },
  { value: "releaseDate-desc", label: "Data de Lançamento (Mais recentes)" },
  { value: "popularity-desc", label: "Mais populares" },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    value: "name-asc",
  },
};

export const SelectedDifferentOption: Story = {
  args: {
    options: defaultOptions,
    value: "releaseDate-desc",
  },
};

export const WithCustomClass: Story = {
  args: {
    options: defaultOptions,
    value: "popularity-desc",
    className: "w-64",
  },
};

export const WithFewOptions: Story = {
  args: {
    options: [
      { value: "price-asc", label: "Preço: Menor primeiro" },
      { value: "price-desc", label: "Preço: Maior primeiro" },
    ],
    value: "price-asc",
  },
};
