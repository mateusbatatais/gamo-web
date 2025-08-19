// components/atoms/Range/Range.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Range } from "./Range";
import { useState } from "react";

const meta: Meta<typeof Range> = {
  title: "Atoms/Range",
  component: Range,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 10, step: 0.1 },
    },
    step: {
      control: { type: "number", min: 0.1, max: 1, step: 0.1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Range>;

const RangeWrapper = (args: React.ComponentProps<typeof Range>) => {
  const [value, setValue] = useState(args.value || 0);
  return <Range {...args} value={value} onChange={setValue} />;
};

export const Basic: Story = {
  args: {
    value: 5,
    label: "Progresso",
  },
};

export const WithoutLabel: Story = {
  args: {
    value: 3,
    showValue: false,
  },
};

export const CustomStep: Story = {
  args: {
    value: 2,
    step: 0.5,
    label: "Avaliação",
  },
};

export const Interactive: Story = {
  render: (args) => <RangeWrapper {...args} />,
  args: {
    value: 0,
    label: "Interativo",
  },
};

export const Disabled: Story = {
  args: {
    value: 7,
    label: "Desabilitado",
    disabled: true,
  },
};
