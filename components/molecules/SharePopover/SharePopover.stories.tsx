import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SharePopover } from "./SharePopover";

const meta: Meta<typeof SharePopover> = {
  title: "Molecules/SharePopover",
  component: SharePopover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    url: { control: "text" },
    title: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof SharePopover>;

export const Default: Story = {
  args: {
    url: "https://gamo.com.br/game/example",
    title: "Amazing Game on Gamo",
  },
};

export const CustomTitle: Story = {
  args: {
    url: "https://gamo.com.br/u/johndoe",
    title: "Check out John Doe's profile",
  },
};
