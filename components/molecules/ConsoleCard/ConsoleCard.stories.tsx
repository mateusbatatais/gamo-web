import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/components/atoms/Badge/Badge";
import { within, userEvent, expect } from "storybook/test";
import ConsoleCard from "./ConsoleCard";

const defaultProps = {
  name: "PlayStation 5",
  consoleName: "PS5",
  brand: "Sony",
  imageUrl: "/images/consoles/sony/ps5.webp",
  description:
    "The PlayStation 5 (PS5) is a home video game console developed by Sony Interactive Entertainment. It is the successor to the PlayStation 4 and was released in November 2020.",
  slug: "playstation-5",
};

const meta: Meta<typeof ConsoleCard> = {
  title: "Components/Molecules/ConsoleCard",
  component: ConsoleCard,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: ["vertical", "horizontal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConsoleCard>;

export const Default: Story = {
  args: { ...defaultProps },
};

export const HorizontalLayout: Story = {
  args: {
    ...defaultProps,
    orientation: "horizontal",
  },
};

export const WithBadge: Story = {
  args: {
    ...defaultProps,
    badge: <Badge status="success">Exclusive</Badge>,
  },
};

export const WithAdditionalContent: Story = {
  args: {
    ...defaultProps,
    children: (
      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">$499.99</span>
    ),
  },
};

export const InDarkMode: Story = {
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
  args: { ...defaultProps },
};

export const Interactive: Story = {
  args: { ...defaultProps },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("PS5")).toBeInTheDocument();

    const link = canvas.getByRole("link");
    await expect(link).toHaveAttribute("href", "/public/images/consoles/sony/ps5.webp");

    await userEvent.click(link);
  },
};

const createGalleryItem = (orientation: "vertical" | "horizontal") => ({
  ...defaultProps,
  orientation,
  consoleName: orientation === "vertical" ? "PS5 Vertical" : "PS5 Horizontal",
});

export const OrientationGallery = () => (
  <div className="grid gap-6 md:grid-cols-2">
    <ConsoleCard {...createGalleryItem("vertical")} />
    <ConsoleCard {...createGalleryItem("horizontal")} />
  </div>
);
