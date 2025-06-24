import clsx from "clsx";

interface BadgeProps {
  variant?: "default" | "primary" | "secondary" | "destructive" | "outline";
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-gray-300 text-gray-700 bg-transparent",
  };

  return <span className={clsx(baseClasses, variantClasses[variant], className)}>{children}</span>;
}
