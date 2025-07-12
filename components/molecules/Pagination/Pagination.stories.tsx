import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pagination from "./Pagination";
import { fn } from "storybook/test";

const meta: Meta<typeof Pagination> = {
  title: "Molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    onPageChange: fn(),
  },
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
    },
    totalPages: {
      control: { type: "number", min: 1 },
    },
    className: {
      control: { type: "text" },
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 3,
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
  },
};

export const CustomClass: Story = {
  args: {
    currentPage: 3,
    totalPages: 8,
    className: "mt-12",
  },
};

export const MobileView: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
