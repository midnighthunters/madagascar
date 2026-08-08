import { cn } from "#/utils/utils";

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
    <button
      name={name}
      data-testid={testId}
      disabled={isDisabled}
      // The type is already passed as a prop to the button component
      // eslint-disable-next-line react/button-has-type
      type={type}
      onClick={onClick}
      className={cn(
        "w-fit min-h-10 px-4 py-2 text-sm font-semibold rounded-xl border-[1.5px] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer transition-[transform,box-shadow,background-color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#D7BC58]/35",
        variant === "primary" &&
          "bg-[#D7BC58] border-[#C7AA42] text-[#342B0E] shadow-[0_4px_0_#B99D39] hover:-translate-y-0.5 hover:bg-[#DFC765] hover:shadow-[0_6px_0_#B99D39] active:translate-y-[3px] active:shadow-[0_1px_0_#B99D39]",
        variant === "secondary" &&
          "bg-white border-[#D8DCE2] text-[#363B42] shadow-[0_3px_0_#DFE2E7] hover:-translate-y-0.5 hover:bg-[#F7F8FA] active:translate-y-0.5 active:shadow-[0_1px_0_#DFE2E7]",
        variant === "danger" &&
          "bg-[#C5483D] border-[#AA3E35] text-white shadow-[0_3px_0_#92342D] hover:bg-[#B94137]",
        variant === "ghost-danger" &&
          "bg-transparent border-transparent text-[#B94137] hover:bg-[#FFF0EE] font-medium",
        startContent && "flex items-center justify-center gap-2",
        className,
      )}
    >
      {startContent}
      {children}
    </button>
  );
}
