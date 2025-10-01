import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Dialog } from "./Dialog";
import { Button } from "../Button/Button";

// Mock dos hooks do Next.js
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Componente wrapper para teste
const TestDialog = ({ open = false, ...props }: Partial<React.ComponentProps<typeof Dialog>>) => {
  return (
    <Dialog title="Test Dialog" onClose={vi.fn()} open={open} {...props}>
      {props.children || "Dialog content"}
    </Dialog>
  );
};

describe("Dialog", () => {
  it("should render dialog when open is true", () => {
    render(<TestDialog open={true} />);

    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });

  it("should not render dialog when open is false", () => {
    render(<TestDialog open={false} />);

    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", async () => {
    const handleClose = vi.fn();

    render(
      <Dialog title="Test Dialog" onClose={handleClose} open={true}>
        Dialog content
      </Dialog>,
    );

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should render subtitle when provided", () => {
    render(<TestDialog open={true} subtitle="This is a subtitle" />);

    expect(screen.getByText("This is a subtitle")).toBeInTheDocument();
  });

  it("should render icon when provided", () => {
    const TestIcon = () => <span data-testid="test-icon">📱</span>;

    render(<TestDialog open={true} icon={<TestIcon />} />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("should render action buttons when provided", () => {
    render(
      <TestDialog
        open={true}
        actionButtons={{
          cancel: { label: "Cancel" },
          confirm: { label: "Save", variant: "primary" as const },
        }}
      />,
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("should render custom actions when provided", () => {
    const customActions = (
      <div data-testid="custom-actions">
        <Button variant="outline" label="Custom Action 1" />
        <Button variant="primary" label="Custom Action 2" />
      </div>
    );

    render(<TestDialog open={true} actions={customActions} />);

    expect(screen.getByTestId("custom-actions")).toBeInTheDocument();
    expect(screen.getByText("Custom Action 1")).toBeInTheDocument();
    expect(screen.getByText("Custom Action 2")).toBeInTheDocument();
  });

  it("should render with different sizes", () => {
    const { rerender } = render(<TestDialog open={true} size="sm" />);

    // O teste verifica se o componente renderiza sem erros para diferentes sizes
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();

    rerender(<TestDialog open={true} size="lg" />);
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
  });

  it("should render text close button when variant is text", () => {
    render(
      <Dialog title="Test Dialog" onClose={vi.fn()} open={true} closeButtonVariant="text">
        Dialog content
      </Dialog>,
    );

    expect(screen.getByText("Fechar")).toBeInTheDocument();
    expect(screen.queryByLabelText("close")).not.toBeInTheDocument();
  });
});
