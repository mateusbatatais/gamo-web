import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GoogleLoginButton } from "./GoogleLoginButton";

const meta: Meta<typeof GoogleLoginButton> = {
  title: "Components/Molecules/GoogleLoginButton",
  component: GoogleLoginButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GoogleLoginButton>;

export const Default: Story = {};
