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
    name: "Wise Owl",
    title: "Lead AI Architect",
    color: "#F59E0B",
    bgGlow: "rgba(245, 158, 11, 0.3)",
  },
  dog: {
    name: "Coder Dog",
    title: "Lead Code Engineer",
    color: "#3B82F6",
    bgGlow: "rgba(59, 130, 246, 0.3)",
  },
  monkey: {
    name: "Inspector Monkey",
    title: "Web & UI Inspector",
    color: "#10B981",
    bgGlow: "rgba(16, 185, 129, 0.3)",
  },
  rabbit: {
    name: "Speedy Rabbit",
    title: "Fast Task Executor",
    color: "#EC4899",
    bgGlow: "rgba(236, 72, 153, 0.3)",
  },
  penguin: {
    name: "Planner Penguin",
    title: "Strategic Planner",
    color: "#06B6D4",
    bgGlow: "rgba(6, 182, 212, 0.3)",
  },
  platypus: {
    name: "Researcher Platypus",
    title: "Deep Researcher",
    color: "#8B5CF6",
    bgGlow: "rgba(139, 92, 246, 0.3)",
  },
  mouse: {
    name: "Runner Mouse",
    title: "Terminal Runner",
    color: "#64748B",
    bgGlow: "rgba(100, 116, 139, 0.3)",
  },
  yellow: {
    name: "Helper Chick",
    title: "Assistant Helper",
    color: "#EAB308",
    bgGlow: "rgba(234, 179, 8, 0.3)",
  },
  cow: {
    name: "Guard Cow",
    title: "System Guard",
    color: "#14B8A6",
    bgGlow: "rgba(20, 184, 166, 0.3)",
  },
  pig: {
    name: "Builder Pig",
    title: "Build & Deployer",
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

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({
  animal = "owl",
  roleName,
  size = "md",
  status,
  showBadge = true,
  className = "",
}) => {
  const info = ANIMAL_MAP[animal] || ANIMAL_MAP.owl;
  const spriteUrl = `/animals/${animal}.webp`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      {/* iOS Frosted Glass Container */}
      <div
        className={`relative ${SIZE_MAP[size]} rounded-2xl p-0.5 backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden`}
        style={{ boxShadow: `0 4px 18px ${info.bgGlow}` }}
      >
        <img
          src={spriteUrl}
          alt={info.name}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Status Ring / Indicator Badge */}
      {showBadge && status && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
          {status === "thinking" || status === "executing" ? (
            <>
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: info.color }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5 border border-white/40"
                style={{ backgroundColor: info.color }}
              />
            </>
          ) : status === "lead" ? (
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-white/60 shadow-sm" />
          ) : (
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white/40" />
          )}
        </span>
      )}
    </div>
  );
};

export const AnimalBadge: React.FC<{
  animal?: AnimalType;
  label?: string;
  size?: "sm" | "md";
}> = ({ animal = "owl", label, size = "sm" }) => {
  const info = ANIMAL_MAP[animal] || ANIMAL_MAP.owl;
  const displayLabel = label || `${info.name}`;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-white/10 border border-white/15 text-white/90 text-xs font-medium shadow-sm hover:bg-white/15 transition-all">
      <AnimalAvatar
        animal={animal}
        size={size === "sm" ? "xs" : "sm"}
        showBadge={false}
      />
      <span>{displayLabel}</span>
    </div>
  );
};
