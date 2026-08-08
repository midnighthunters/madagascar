import React from "react";

export type AnimalType =
  | "owl"
  | "dog"
  | "monkey"
  | "mouse"
  | "penguin"
  | "pig"
  | "platypus"
  | "rabbit"
  | "yellow"
  | "cow";

export interface AnimalAvatarProps {
  animal?: AnimalType;
  roleName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "thinking" | "executing" | "idle" | "lead";
  showBadge?: boolean;
  className?: string;
}

export const ANIMAL_MAP: Record<
  AnimalType,
  { name: string; title: string; color: string; bgGlow: string }
> = {
  owl: {
    name: "Owl agent",
    title: "Lead architect",
    color: "#F59E0B",
    bgGlow: "rgba(245, 158, 11, 0.3)",
  },
  dog: {
    name: "Dog agent",
    title: "Code engineer",
    color: "#3B82F6",
    bgGlow: "rgba(59, 130, 246, 0.3)",
  },
  monkey: {
    name: "Monkey agent",
    title: "UI inspector",
    color: "#10B981",
    bgGlow: "rgba(16, 185, 129, 0.3)",
  },
  rabbit: {
    name: "Rabbit agent",
    title: "Task executor",
    color: "#EC4899",
    bgGlow: "rgba(236, 72, 153, 0.3)",
  },
  penguin: {
    name: "Penguin agent",
    title: "Planner",
    color: "#06B6D4",
    bgGlow: "rgba(6, 182, 212, 0.3)",
  },
  platypus: {
    name: "Platypus agent",
    title: "Researcher",
    color: "#8B5CF6",
    bgGlow: "rgba(139, 92, 246, 0.3)",
  },
  mouse: {
    name: "Mouse agent",
    title: "Terminal operator",
    color: "#64748B",
    bgGlow: "rgba(100, 116, 139, 0.3)",
  },
  yellow: {
    name: "Yellow agent",
    title: "Assistant",
    color: "#EAB308",
    bgGlow: "rgba(234, 179, 8, 0.3)",
  },
  cow: {
    name: "Cow agent",
    title: "System guard",
    color: "#14B8A6",
    bgGlow: "rgba(20, 184, 166, 0.3)",
  },
  pig: {
    name: "Pig agent",
    title: "Build engineer",
    color: "#F43F5E",
    bgGlow: "rgba(244, 63, 94, 0.3)",
  },
};

const SIZE_MAP = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export function AnimalAvatar({
  animal = "owl",
  roleName,
  size = "md",
  status,
  showBadge = true,
  className = "",
}: AnimalAvatarProps) {
  const info = ANIMAL_MAP[animal] || ANIMAL_MAP.owl;
  const spriteUrl = `/animals/${animal}.webp`;
  const accessibleName = roleName ? `${info.name}: ${roleName}` : info.name;
  const isWorking = status === "thinking" || status === "executing";

  let statusIndicator: React.ReactNode;
  if (isWorking) {
    statusIndicator = (
      <>
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: info.color }}
        />
        <span
          className="relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-white"
          style={{ backgroundColor: info.color }}
        />
      </>
    );
  } else if (status === "lead") {
    statusIndicator = (
      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-white shadow-sm" />
    );
  } else {
    statusIndicator = (
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 border-2 border-white" />
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <div
        className={`relative ${SIZE_MAP[size]} rounded-xl p-0.5 bg-white border border-[#E7E9ED] shadow-[0_2px_0_#DFE2E7] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 overflow-hidden`}
      >
        <img
          src={spriteUrl}
          alt={accessibleName}
          className="w-full h-full object-cover rounded-[9px]"
          onError={(event) => {
            const failedImage = event.currentTarget;
            failedImage.style.display = "none";
          }}
        />
      </div>

      {showBadge && status && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
          {statusIndicator}
        </span>
      )}
    </div>
  );
}

export function AnimalBadge({
  animal = "owl",
  label,
  size = "sm",
}: {
  animal?: AnimalType;
  label?: string;
  size?: "sm" | "md";
}) {
  const info = ANIMAL_MAP[animal] || ANIMAL_MAP.owl;
  const displayLabel = label || `${info.name}`;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#E7E9ED] text-[#4B5159] text-xs font-medium shadow-[0_2px_0_#DFE2E7] hover:bg-[#F7F8FA] transition-all">
      <AnimalAvatar
        animal={animal}
        size={size === "sm" ? "xs" : "sm"}
        showBadge={false}
      />
      <span>{displayLabel}</span>
    </div>
  );
}
