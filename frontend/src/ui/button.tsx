import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/utils/utils";

export const buttonVariants = cva(
  "md-button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border font-semibold outline-none disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary: "md-button--primary",
        secondary: "md-button--secondary",
        ghost: "md-button--ghost",
        danger: "md-button--danger",
        "ghost-danger": "md-button--ghost-danger",
        icon: "md-button--icon",
      },
      size: {
        compact: "h-8 rounded-xl px-2.5 text-xs [&_svg]:size-4",
        default: "h-10 rounded-[13px] px-4 text-sm [&_svg]:size-[18px]",
        large: "h-12 rounded-[14px] px-5 text-[15px] [&_svg]:size-5",
        icon: "size-9 rounded-xl p-0 [&_svg]:size-[18px]",
      },
    },
    defaultVariants: { variant: "secondary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && <span className="md-button-spinner" aria-hidden="true" />}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
