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

export interface AgentIdentityProps extends AnimalAvatarProps {
  label?: string;
  detail?: string;
  align?: "start" | "center";
}

export const ANIMAL_MAP: Record<AnimalType, { name: string; title: string }> = {
  owl: {
    name: "Owl agent",
    title: "Lead architect",
  },
  dog: {
    name: "Dog agent",
    title: "Code engineer",
  },
  monkey: {
    name: "Monkey agent",
    title: "UI inspector",
  },
  rabbit: {
    name: "Rabbit agent",
    title: "Task executor",
  },
  penguin: {
    name: "Penguin agent",
    title: "Planner",
  },
  platypus: {
    name: "Platypus agent",
    title: "Researcher",
  },
  mouse: {
    name: "Mouse agent",
    title: "Terminal operator",
  },
  yellow: {
    name: "Yellow agent",
    title: "Assistant",
  },
  cow: {
    name: "Cow agent",
    title: "System guard",
  },
  pig: {
    name: "Pig agent",
    title: "Build engineer",
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
  let statusIndicator: React.ReactNode;
  if (status === "thinking" || status === "executing") {
    statusIndicator = (
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-surface bg-status-warning" />
    );
  } else if (status === "lead") {
    statusIndicator = (
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-surface bg-action" />
    );
  } else {
    statusIndicator = (
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-surface bg-status-success" />
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <div
        className={`relative ${SIZE_MAP[size]} overflow-hidden rounded-xl border border-line bg-surface-raised p-0.5 shadow-[var(--md-shadow-control)]`}
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
    <div className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface-raised px-2.5 py-1 text-xs font-medium text-ink-secondary shadow-[var(--md-shadow-control)]">
      <AnimalAvatar
        animal={animal}
        size={size === "sm" ? "xs" : "sm"}
        showBadge={false}
      />
      <span>{displayLabel}</span>
    </div>
  );
}

export function AgentIdentity({
  animal = "owl",
  label,
  detail,
  align = "start",
  ...avatarProps
}: AgentIdentityProps) {
  const info = ANIMAL_MAP[animal];
  return (
    <div
      className={`inline-flex min-w-0 items-center gap-3 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {/* Stable avatar composition forwards the public avatar contract. */}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <AnimalAvatar animal={animal} {...avatarProps} />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-ink">
          {label || info.title}
        </div>
        {detail && (
          <div className="truncate text-xs text-ink-secondary">{detail}</div>
        )}
      </div>
    </div>
  );
}
