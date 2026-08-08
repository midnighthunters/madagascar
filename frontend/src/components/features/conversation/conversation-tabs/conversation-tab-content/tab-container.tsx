import { ReactNode } from "react";

interface TabContainerProps {
  children: ReactNode;
}

export function TabContainer({ children }: TabContainerProps) {
  return (
    <div className="bg-editor border border-line rounded-[18px] flex flex-col h-full w-full overflow-hidden shadow-[var(--md-shadow-card)] text-ink">
      {children}
    </div>
  );
}
