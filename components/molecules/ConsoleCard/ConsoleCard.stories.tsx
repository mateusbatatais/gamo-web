import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ConsoleCard from "./ConsoleCard";

const imgeUrl = "/public/images/consoles/sony/ps5.webp"; // Placeholder image URL

const meta: Meta<typeof ConsoleCard> = {
  title: "Components/Molecules/ConsoleCard",
  component: ConsoleCard,
  tags: ["autodocs"],
  argTypes: {
    imageUrl: { control: "text" },
    name: { control: "text" },
    consoleName: { control: "text" },
    brand: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ConsoleCard>;

export const Default: Story = {
  args: {
    name: "PlayStation 5",
    consoleName: "PS5",
    brand: "Sony",
    imageUrl: imgeUrl, // Placeholder image URL
    description: "The PlayStation 5 is Sony's 9th generation console.",
  },
};

export const WithIcon: Story = {
  args: {
    name: "PlayStation 5",
    consoleName: "PS5",
    brand: "Sony",
    imageUrl: imgeUrl, // Placeholder image URL
    description: "The PlayStation 5 is Sony's 9th generation console.",
  },
};

export const CustomDescription: Story = {
  args: {
    name: "Xbox Series X",
    consoleName: "Xbox Series X",
    brand: "Microsoft",
    imageUrl: imgeUrl, // Placeholder image URL
    description: "The Xbox Series X is the next-gen console from Microsoft.",
  },
};
