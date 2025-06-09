import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Header from "./Header";

type Story = StoryObj<typeof Header>;

const meta: Meta<typeof Header> = {
  title: "Components/Templates/Layout/Header",
  component: Header,
  tags: ["autodocs"],
};

export default meta;

export const Default: Story = {};
