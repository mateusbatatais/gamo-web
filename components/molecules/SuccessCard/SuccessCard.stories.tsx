import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SuccessCard } from "./SuccessCard";
import { AlertCircle, AlertTriangle, ShieldCheck } from "lucide-react";

const meta: Meta<typeof SuccessCard> = {
  title: "Molecules/SuccessCard",
  component: SuccessCard,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: { type: "select" },
      options: ["success", "info", "warning", "danger", "default"],
    },
    buttonVariant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "transparent"],
    },
    buttonStatus: {
      control: { type: "select" },
      options: ["default", "success", "danger", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SuccessCard>;

export const Success: Story = {
  args: {
    title: "Payment Successful!",
    message: "Your payment has been processed successfully.",
    buttonHref: "/dashboard",
    buttonLabel: "View Dashboard",
    status: "success",
  },
};

export const Info: Story = {
  args: {
    title: "Account Updated",
    message: "Your account information has been updated.",
    buttonHref: "/profile",
    buttonLabel: "View Profile",
    status: "info",
    icon: <AlertCircle className="w-16 h-16" />,
  },
};

export const Warning: Story = {
  args: {
    title: "Action Required",
    message: "Please verify your email address to continue.",
    buttonHref: "/verify",
    buttonLabel: "Resend Verification",
    status: "warning",
    icon: <AlertTriangle className="w-16 h-16" />,
    buttonVariant: "outline",
    buttonStatus: "warning",
  },
};

export const Danger: Story = {
  args: {
    title: "Action Failed",
    message: "We encountered an issue processing your request.",
    buttonHref: "/support",
    buttonLabel: "Contact Support",
    status: "danger",
    icon: <ShieldCheck className="w-16 h-16" />,
    buttonVariant: "primary",
    buttonStatus: "danger",
  },
};

export const WithAdditionalContent: Story = {
  args: {
    ...Success.args,
    additionalContent: (
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
        <p>Transaction ID: ABC123XYZ</p>
        <p className="mt-2">Date: {new Date().toLocaleDateString()}</p>
      </div>
    ),
  },
};

export const CustomButton: Story = {
  args: {
    ...Success.args,
    buttonLabel: "Continue Shopping",
    buttonHref: "/store",
    buttonVariant: "secondary",
  },
};

export const WithoutIcon: Story = {
  args: {
    ...Success.args,
    icon: null,
  },
};

export const StatusGallery = () => (
  <div className="space-y-6">
    {(["success", "info", "warning", "danger", "default"] as const).map((status) => (
      <SuccessCard
        key={status}
        title={`${status.charAt(0).toUpperCase() + status.slice(1)} State`}
        message={`This is a ${status} notification card.`}
        buttonHref="#"
        buttonLabel={`${status} Action`}
        status={status}
      />
    ))}
  </div>
);
