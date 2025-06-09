import { Meta, StoryObj } from "@storybook/nextjs-vite";
import AdminHeader from "./AdminHeader";

type Story = StoryObj<typeof AdminHeader>;

const meta: Meta<typeof AdminHeader> = {
  title: "Components/Templates/Admin/Header",
  component: AdminHeader,
  tags: ["autodocs"],
};

export default meta;

export const Default: Story = {};
