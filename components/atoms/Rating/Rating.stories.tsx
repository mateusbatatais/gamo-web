// components/atoms/Rating/Rating.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Rating } from "./Rating";
import { useState } from "react";

const meta: Meta<typeof Rating> = {
  title: "Atoms/Rating",
  component: Rating,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    value: {
      control: { type: "range", min: 0, max: 10, step: 0.5 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

const RatingWrapper = (args: React.ComponentProps<typeof Rating>) => {
  const [value, setValue] = useState(args.value || 0);
  return <Rating {...args} value={value} onChange={setValue} />;
};

export const Basic: Story = {
  args: {
    value: 7.5,
  },
};

export const Small: Story = {
  args: {
    ...Basic.args,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    ...Basic.args,
    size: "lg",
  },
};

export const ReadOnly: Story = {
  args: {
    ...Basic.args,
    readOnly: true,
  },
};

export const Interactive: Story = {
  render: (args) => <RatingWrapper {...args} />,
  args: {
    value: 0,
  },
};
