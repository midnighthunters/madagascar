import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/utils/utils";

const cardVariants = cva(
  "flex border-[1.5px] transition-[transform,box-shadow,border-color,background-color] duration-150",
  {
    variants: {
      theme: {
        default:
          "relative bg-white border-[#E7E9ED] rounded-[22px] shadow-[0_4px_0_#DFE2E7,0_8px_20px_rgba(20,30,50,0.04)]",
        outlined:
          "relative bg-white border-[#D8DCE2] rounded-[22px] shadow-[0_2px_0_#E7E9ED]",
        dark: "relative bg-[#191C20] border-[#30343A] rounded-[18px] text-white shadow-[0_4px_0_#111316]",
      },
      hover: {
        none: "",
        elevated: [
          "hover:-translate-y-0.5 hover:border-[#D8DCE2]",
          "hover:shadow-[0_6px_0_#DFE2E7,0_12px_24px_rgba(20,30,50,0.06)]",
          "active:translate-y-[3px] active:shadow-[0_1px_0_#DFE2E7]",
        ].join(" "),
      },
      gradient: {
        none: "",
        standard: [
          "bg-white border-[#E7E9ED]",
          "shadow-[0_4px_0_#DFE2E7,0_8px_20px_rgba(20,30,50,0.04)]",
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
