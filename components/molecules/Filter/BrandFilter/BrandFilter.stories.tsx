// components/molecules/Filter/BrandFilter.stories.tsx
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import BrandFilter from "./BrandFilter";

const meta: Meta<typeof BrandFilter> = {
  title: "Components/Molecules/Filter/BrandFilter",
  component: BrandFilter,
  tags: ["autodocs"],
  argTypes: {
    onBrandChange: { action: "brandChanged" },
  },
};

export default meta;

type Story = StoryObj<typeof BrandFilter>;

export const Default: Story = {
  args: {
    selectedBrands: ["sony", "microsoft"],
    onBrandChange: (brands) => console.log("Selected brands:", brands),
  },
};

export const WithBrands: Story = {
  args: {
    selectedBrands: ["sony", "microsoft"],
    onBrandChange: (brands) => console.log("Selected WithBrands:", brands),
  },
};

export const EmptyState: Story = {
  args: {
    selectedBrands: [],
    onBrandChange: (brands) => console.log("Selected EmptyState:", brands),
  },
};
