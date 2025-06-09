import { Meta, StoryObj } from "@storybook/nextjs-vite";
import AdminSidebar from "./AdminSidebar";

type Story = StoryObj<typeof AdminSidebar>;

const meta: Meta<typeof AdminSidebar> = {
  title: "Components/Templates/Admin/Sidebar",
  component: AdminSidebar,
  tags: ["autodocs"],
};

export default meta;

export const Default: Story = {};
