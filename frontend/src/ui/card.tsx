import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/utils/utils";

const cardVariants = cva(
  "flex border-[1.5px] transition-[transform,box-shadow,border-color,background-color] duration-150",
  {
    variants: {
      theme: {
        default: "relative bg-surface border-line rounded-[18px] md-surface-card",
        outlined:
          "relative bg-surface border-line-strong rounded-[18px] shadow-[var(--md-shadow-control)]",
        dark: "relative bg-editor border-line rounded-[18px] text-ink shadow-[var(--md-shadow-card)]",
      },
      hover: {
        none: "",
        elevated: [
          "hover:-translate-y-0.5 hover:border-line-strong",
          "hover:shadow-[var(--md-shadow-card)]",
          "active:translate-y-px active:shadow-none",
        ].join(" "),
      },
      gradient: {
        none: "",
        standard: [
          "bg-surface border-line",
          "shadow-[var(--md-shadow-card)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      theme: "default",
      hover: "none",
      gradient: "none",
    },
  },
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children?: ReactNode;
  className?: string;
  testId?: string;
}

export function Card({
  children,
  className,
  testId,
  theme,
  hover,
  gradient,
}: CardProps) {
  return (
    <div
      data-testid={testId}
      className={cn(cardVariants({ theme, hover, gradient }), className)}
    >
      {children}
    </div>
  );
}
