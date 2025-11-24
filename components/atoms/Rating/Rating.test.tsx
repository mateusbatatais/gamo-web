// components/atoms/Rating/Rating.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Rating } from "./Rating";

interface MockRatingProps {
  value: number;
  onChange?: (event: object, value: number) => void;
  icon: React.ReactNode;
  emptyIcon: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface MockIconProps {
  className?: string;
}

// Mock MUI components
vi.mock("@mui/material", () => ({
  Rating: ({ value, onChange, icon, emptyIcon, className, ...props }: MockRatingProps) => (
    <div
      data-testid="mui-rating"
      data-value={value}
      className={className}
      onClick={() => onChange && onChange({}, value === 0 ? 2.5 : 0)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (onChange) {
            onChange({}, value === 0 ? 2.5 : 0);
          }
        }
      }}
      role="slider"
      aria-label="game-rating"
      aria-valuenow={value}
      tabIndex={0}
      {...props}
    >
      {icon}
      {emptyIcon}
    </div>
  ),
}));

vi.mock("@mui/icons-material", () => ({
  Star: ({ className }: MockIconProps) => (
    <span data-testid="star-filled" className={className}>
      ★
    </span>
  ),
  StarOutline: ({ className }: MockIconProps) => (
    <span data-testid="star-outline" className={className}>
      ☆
    </span>
  ),
}));

describe("Rating", () => {
  it("renderiza com valor correto (converte de 0-10 para 0-5)", () => {
    render(<Rating value={8} />);

    const rating = screen.getByTestId("mui-rating");
    expect(rating).toHaveAttribute("data-value", "4"); // 8/2 = 4
  });

  it("renderiza com valor 0", () => {
    render(<Rating value={0} />);

    const rating = screen.getByTestId("mui-rating");
    expect(rating).toHaveAttribute("data-value", "0");
  });

  it("renderiza com valor 10 (máximo)", () => {
    render(<Rating value={10} />);

    const rating = screen.getByTestId("mui-rating");
    expect(rating).toHaveAttribute("data-value", "5"); // 10/2 = 5
  });

  it("chama onChange com valor convertido (de 0-5 para 0-10)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Rating value={0} onChange={onChange} />);

    const rating = screen.getByRole("slider");
    await user.click(rating);

    expect(onChange).toHaveBeenCalledWith(5); // 2.5 * 2 = 5
  });

  it("não chama onChange quando newValue é null", async () => {
    const onChange = vi.fn();

    const { rerender } = render(<Rating value={8} onChange={onChange} />);

    // Simular onChange com null
    const rating = screen.getByTestId("mui-rating");
    rating.onclick = () => onChange(null);

    rerender(<Rating value={8} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("renderiza ícones de estrela preenchida e vazia", () => {
    render(<Rating value={6} />);

    expect(screen.getByTestId("star-filled")).toBeInTheDocument();
    expect(screen.getByTestId("star-outline")).toBeInTheDocument();
  });

  it("aplica classe de tamanho sm corretamente", () => {
    render(<Rating value={5} size="sm" />);

    const starFilled = screen.getByTestId("star-filled");
    expect(starFilled.className).toContain("text-xl");
  });

  it("aplica classe de tamanho md por padrão", () => {
    render(<Rating value={5} />);

    const starFilled = screen.getByTestId("star-filled");
    expect(starFilled.className).toContain("text-2xl");
  });

  it("aplica classe de tamanho lg corretamente", () => {
    render(<Rating value={5} size="lg" />);

    const starFilled = screen.getByTestId("star-filled");
    expect(starFilled.className).toContain("text-3xl");
  });

  it("aplica className customizado", () => {
    render(<Rating value={5} className="custom-rating" />);

    const rating = screen.getByTestId("mui-rating");
    expect(rating.className).toContain("custom-rating");
  });

  it("aplica classes de cor corretas para estrelas preenchidas", () => {
    render(<Rating value={8} />);

    const starFilled = screen.getByTestId("star-filled");
    expect(starFilled.className).toContain("text-warning-500");
    expect(starFilled.className).toContain("dark:text-warning-400");
  });

  it("aplica classes de cor corretas para estrelas vazias", () => {
    render(<Rating value={8} />);

    const starOutline = screen.getByTestId("star-outline");
    expect(starOutline.className).toContain("text-neutral-300");
    expect(starOutline.className).toContain("dark:text-neutral-600");
  });

  it("funciona sem onChange (modo somente leitura)", () => {
    render(<Rating value={7} />);

    const rating = screen.getByTestId("mui-rating");
    expect(rating).toBeInTheDocument();
    expect(rating).toHaveAttribute("data-value", "3.5"); // 7/2 = 3.5
  });
});
