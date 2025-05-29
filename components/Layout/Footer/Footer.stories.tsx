import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Footer from "./Footer";

type Story = StoryObj<typeof Footer>;

const meta: Meta<typeof Footer> = {
  title: "Layout/Footer",
  component: Footer,
  tags: ["autodocs"],
};

export default meta;

export const Default: Story = {};
