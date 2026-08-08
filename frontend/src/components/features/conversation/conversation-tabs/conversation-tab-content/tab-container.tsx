import { ReactNode } from "react";

interface TabContainerProps {
  children: ReactNode;
}

export function TabContainer({ children }: TabContainerProps) {
  return (
    <div className="bg-[#191C20] border-[1.5px] border-[#30343A] rounded-[18px] flex flex-col h-full w-full overflow-hidden shadow-[0_4px_0_#111316]">
      {children}
    </div>
  );
}
