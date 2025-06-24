// src/stories/molecules/SocialLoginButton.stories.tsx
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton/SocialLoginButton";

const meta: Meta<typeof SocialLoginButton> = {
  title: "Molecules/SocialLoginButton",
  component: SocialLoginButton,
  argTypes: {
    provider: {
      control: "select",
      options: ["google", "microsoft", "apple"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SocialLoginButton>;

export const Google: Story = {
  args: {
    provider: "google",
  },
};

export const Microsoft: Story = {
  args: {
    provider: "microsoft",
  },
};

export const Apple: Story = {
  args: {
    provider: "apple",
  },
};

export const LoadingState: Story = {
  args: {
    provider: "google",
  },
  render: (args) => (
    <div className="relative">
      <SocialLoginButton {...args} />
      {/* Simular estado de loading */}
      <style>{`
        button {
          position: relative;
        }
        button:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  ),
};
