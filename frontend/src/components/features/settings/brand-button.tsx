import { cn } from "#/utils/utils";
import { Button } from "#/ui/button";

interface BrandButtonProps {
  testId?: string;
  name?: string;
  variant: "primary" | "secondary" | "danger" | "ghost-danger";
  type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  isDisabled?: boolean;
  className?: string;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  startContent?: React.ReactNode;
}

export function BrandButton({
  testId,
  name,
  children,
  variant,
  type,
  isDisabled,
  className,
  onClick,
  startContent,
}: React.PropsWithChildren<BrandButtonProps>) {
  return (
    <Button
      name={name}
      data-testid={testId}
      disabled={isDisabled}
      // The type is already passed as a prop to the button component
      // eslint-disable-next-line react/button-has-type
      type={type}
      onClick={onClick}
      variant={variant}
      className={cn(
        "w-fit",
        startContent && "flex items-center justify-center gap-2",
        className,
      )}
    >
      {startContent}
      {children}
    </Button>
  );
}
