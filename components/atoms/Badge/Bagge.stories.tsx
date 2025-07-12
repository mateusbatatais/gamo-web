import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge, BadgeProps } from "./Badge";

const meta: Meta<BadgeProps> = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["solid", "outline", "soft"],
    },
    status: {
      control: { type: "select" },
      options: ["default", "primary", "secondary", "success", "danger", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<BadgeProps>;

export const SolidPrimary: Story = {
  args: {
    children: "Solid Primary",
    variant: "solid",
    status: "primary",
  },
};

export const OutlineSuccess: Story = {
  args: {
    children: "Outline Success",
    variant: "outline",
    status: "success",
  },
};

export const SoftDanger: Story = {
  args: {
    children: "Soft Danger",
    variant: "soft",
    status: "danger",
  },
};

export const SmallWarning: Story = {
  args: {
    children: "Small Warning",
    size: "sm",
    status: "warning",
  },
};

export const LargeInfo: Story = {
  args: {
    children: "Large Info",
    size: "lg",
    status: "info",
  },
};

export const StatusGallery = () => (
  <div className="flex flex-wrap gap-2">
    {(["default", "primary", "secondary", "success", "danger", "warning", "info"] as const).map(
      (status) => (
        <Badge key={status} status={status}>
          {status}
        </Badge>
      ),
    )}
  </div>
);

export const VariantGallery = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-2">
      {(["solid", "outline", "soft"] as const).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {(["solid", "outline", "soft"] as const).map((variant) => (
        <Badge key={variant} variant={variant} status="primary">
          {variant} primary
        </Badge>
      ))}
    </div>
  </div>
);
